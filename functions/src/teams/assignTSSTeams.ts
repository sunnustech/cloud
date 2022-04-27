import { https } from 'firebase-functions'
import { InitializeTeam } from '../types/sunnus-init'
// import { firestore } from 'firebase-admin'
// import { WriteResult } from '@google-cloud/firestore'
import { assignTSSTeams as keyCheck } from '../utils/keyChecks'
import { hasMissingKeys } from '../utils'

const main = async (teamList: InitializeTeam[]) => {
  // for each sport:
  // randomize order
  // get number of teams
  // assign a letter and a number to each team
  const volleyballs = teamList
    .filter((x) => x.registeredEvents.TSS.volleyball)
    .map((x) => x.teamName)
  console.log(volleyballs)
}

export const assignTSSTeams = https.onRequest(async (req, res) => {
  const [err, status] = hasMissingKeys(keyCheck, req)
  if (status === 'missing') {
    res.json({ message: err })
    return
  }
  // const a = res.body.asdf()
  const teamList: InitializeTeam[] = req.body.teamList
  main(teamList)
  res.json({
    result: 'server: assigned TSS teams to their starting buckets',
  })
})
