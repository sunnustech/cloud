import { https } from 'firebase-functions'
import { InitializeTeam } from '../types/sunnus-init'
// import { firestore } from 'firebase-admin'
// import { WriteResult } from '@google-cloud/firestore'
import { assignTSSTeams as keyCheck } from '../utils/keyChecks'
import { hasMissingKeys } from '../utils'
import { sportList } from '../data/constants'
import { shuffle } from '../utils/team'

const main = async (teamList: InitializeTeam[]) => {
  // for each sport:
  // randomize order
  // get number of teams
  // assign a letter and a number to each team
  sportList.forEach((sport) => {
    const teamsOfThisSport = teamList
      .filter((x) => x.registeredEvents.TSS[sport])
      .map((x) => x.teamName)
    shuffle(teamsOfThisSport)
    console.log(sport, shuffle(teamsOfThisSport))
  })
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
