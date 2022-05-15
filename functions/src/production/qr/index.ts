import { https } from 'firebase-functions'
import { handleQR as keyCheck } from '../../utils/keyChecks'
import { _hasMissingKeys } from '../../utils/exits'
import { fs } from '../../init'
import { converter } from '../../classes/firebase'
import { QR } from '../../classes/QR'

// entry point for all QR queries
export const QRApi = https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new https.HttpsError('unauthenticated', 'Please log in first')
  }

  // check keys
  const keyCheckResult = _hasMissingKeys(keyCheck, data)
  if (keyCheckResult !== 'all ok') {
    return { message: keyCheckResult }
  }

  // extract required keys
  const { teamName, command, points, facilitator, station } = data

  // require a non-empty team name
  if (teamName === '') {
    return { meesage: 'Empty team name.' }
  }

  // get a reference to the teams collection
  const teamsCollection = fs.collection('teams').withConverter(converter.team)

  // get a reference to the target team
  const teamRef = teamsCollection.doc(teamName)

  // exit if team doesn't exist
  const snapshot = await teamRef.get()
  if (!snapshot.exists) {
    return { message: 'This team doesn\'t exist' }
  }

  const team = snapshot.data()
  if (!team) {
    return { message: 'Unable to fetch team' }
  }

  const qr = new QR({ teamName, command, points, facilitator, station })

  const status = await team.task(qr)

  return {
    message: `finished processing QR command for [${teamName}]`,
    status,
  }
})
