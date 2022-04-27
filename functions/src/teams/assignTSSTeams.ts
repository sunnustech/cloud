import { https } from 'firebase-functions'
import { InitializeTeam } from '../types/sunnus-init'
// import { firestore } from 'firebase-admin'
// import { WriteResult } from '@google-cloud/firestore'
import { assignTSSTeams as keyCheck } from '../utils/keyChecks'
import { hasMissingKeys } from '../utils'
import { sportCapacity, sportList } from '../data/constants'
import { shuffle } from '../utils/team'
import { Sport } from '../types'
import { TSSTag } from '../types/sunnus-firestore'

/**
 * @param {InitializeTeam[]} teamList
 * @param {Sport} sport
 * @return {string[]} list of teamnames from that sport
 */
function getTeamNamesOfSport(
  teamList: InitializeTeam[],
  sport: Sport
): string[] {
  return teamList
    .filter((x) => x.registeredEvents.TSS[sport])
    .map((x) => x.teamName)
}

/**
 * @param {string[]} teamNames
 * @param {Sport} sport
 * @returns {Record<string, TSSTag>} TSSTags for each team
 */
function addId(teamNames: string[], sport: Sport): Record<string, TSSTag> {
  const count = teamNames.length
  // const letters = ['A', 'B', 'C', 'D']
  const result = {}
  const max = sportCapacity[sport]
  console.debug('addId:', `${count}/${max} -- ${sport}`)
  return result
}

const main = async (teamList: InitializeTeam[]) => {
  // for each sport:
  // randomize order
  // get number of teams
  // assign a letter and a number to each team
  sportList.forEach((sport) => {
    const teamNames = getTeamNamesOfSport(teamList, sport)
    // for testing purposes
    const didntCome = 1
    const turnUp = teamNames.length - didntCome
    // end of testing code
    shuffle(teamNames)
    addId(teamNames.slice(0, turnUp), sport)
    // console.log(sport, teamNames)
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
