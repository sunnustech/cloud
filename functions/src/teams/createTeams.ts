import { https } from 'firebase-functions'
import { Team } from '../classes/team'
import { WriteResult } from '@google-cloud/firestore'
import { hasMissingKeys } from '../utils/exits'
import { createTeams as keyCheck } from '../utils/keyChecks'
// import { makeTeam } from '../utils/team'
import { getTeamsFromCsv, hasMissingHeaders } from '../utils/parseCsv'
import { firestore } from 'firebase-admin'
import { getAllExistingValues } from '../utils/firestore'

export const createTeams = https.onRequest(async (req, res) => {
  // check keys
  if (hasMissingKeys(keyCheck, req, res)) return

  // check csv headers
  const csv = req.body.teamListCsvString
  // prettier-ignore
  const required = [ 'teamName', 'touchRugby', 'dodgeball', 'frisbee',
    'tchoukball', 'volleyball', 'captainsBall', 'SOAR', 'direction' ]
  if (hasMissingHeaders(required, csv, res)) return

  // get existing list of team names
  const already = await getAllExistingValues('teams', 'teamName')

  // get list of new teams to make
  const teamList: Team[] = getTeamsFromCsv(csv).filter(
    (team) => !already.exists(team.teamName)
  )

  const teamsCollection = firestore()
    .collection('teams')
    .withConverter(Team.converter)

  // write the team data to collections
  const q: Promise<WriteResult>[] = []
  teamList.forEach((team) => {
    q.push(teamsCollection.doc(team.teamName).set(team))
  })
  const result = await Promise.all(q) // only returns writeTime, nothing to capture here
  
  res.json({
    message: "successfully created teams",
    result
  })
})
