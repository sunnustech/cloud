import { https } from 'firebase-functions'
import { hasMissingKeys, isEmpty } from '../utils/exits'
import { handleQR as keyCheck } from '../utils/keyChecks'
import { firestore } from 'firebase-admin'
import { converter } from '../classes/firebase'

// entry point for all QR queries
export const QRApi = https.onRequest(async (req, res) => {
  // check keys
  if (hasMissingKeys(keyCheck, req, res)) return

  // extract required keys
  // const { facilitator, points, command, station, teamName } = req.body
  const { teamName } = req.body

  // require a non-empty team name
  if (isEmpty(teamName, res)) return

  // get a reference to the teams collection
  const teamsCollection = firestore()
    .collection('teams')
    .withConverter(converter.team)

  // get a reference to the target team
  const teamRef = teamsCollection.doc(teamName)

  // exit if team doesn't exist
  const snapshot = await teamRef.get()
  if (!snapshot.exists) {
    res.json({ message: "This team doesn't exist" })
    return
  }

  const team = snapshot.data()
  if (!team) {
    res.json({ message: "Unable to fetch team" })
    return
  }

  team.startTimer()
  console.log(team)

  res.json({
    message: `successfully processed QR command for team ${teamName}`,
  })
})
