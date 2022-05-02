import { https } from 'firebase-functions'
import { InitializeTeam } from '../types/sunnus-init'
import { firestore } from 'firebase-admin'
import { WriteResult } from '@google-cloud/firestore'
import { please as keyCheck } from '../utils/keyChecks'
import { hasMissingKeys } from '../utils/exits'
import { sportCapacity, sportList } from '../data/constants'
import { shuffle } from '../utils/team'
import { Sport } from '../types'

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
 * @returns {TempRecord} TSSIds for each team
 */
type TempRecord = Record<string, string>
function getTSSIds(teamNames: string[], sport: Sport): TempRecord {
  const max = sportCapacity[sport]
  const turnUp = teamNames.length
  if (turnUp > max) {
    console.warn('There are more teams than the maximum capacity allowed')
    return {}
  }
  const letters: string[] = ['A', 'B', 'C', 'D']
  const result: TempRecord = {}
  const groups = Array(4).fill(max / 4)
  const didntCome = max - turnUp
  for (let i = 0; i < didntCome; i++) {
    groups[i % 4] -= 1
  }
  letters.forEach((letter, index) => {
    for (let i = 0; i < groups[index]; i++) {
      const teamName = teamNames.pop() || ''
      if (teamName === '') {
        console.warn('assignTSSTeams: not enough teamNames supplied')
      }
      result[teamName] = `${letter}${i + 1}`
    }
  })
  return result
}

const main = async (teamList: InitializeTeam[]): Promise<WriteResult[]> => {
  // for each sport:
  // randomize order
  // get number of teams
  // assign a letter and a number to each team
  const awaitStack: Promise<WriteResult>[] = []
  const teamCollection = firestore().collection('teams')
  const cache: Record<Sport, Record<string, string>> = {
    volleyball: {},
    tchoukball: {},
    touchRugby: {},
    frisbee: {},
    captainsBall: {},
    dodgeball: {},
  }
  sportList.forEach((sport) => {
    const teamNames = getTeamNamesOfSport(teamList, sport)
    // for testing purposes
    // for deployment, set didntCome = 0
    const didntCome = 0
    const turnUp = teamNames.length - didntCome
    // end of testing code
    shuffle(teamNames)
    const TSSIds = getTSSIds(teamNames.slice(0, turnUp), sport)

    teamNames.forEach((teamName) => {
      const id = TSSIds[teamName]
      cache[sport][id] = teamName
      awaitStack.push(teamCollection.doc(teamName).update({ sport, TSSId: id }))
    })
  })
  awaitStack.push(
    firestore()
      .collection('shared')
      .doc('main')
      .update({ assignedTeams: true }),
    firestore().collection('shared').doc('tssRoundRobinCache').update(cache)
  )
  const writeResult = await Promise.all(awaitStack)
  return writeResult
}

export const assignTSSTeams = https.onRequest(async (req, res) => {
  if (hasMissingKeys(keyCheck, req, res)) return

  // const a = res.body.asdf()
  const teamList: InitializeTeam[] = req.body.teamList
  const writeResult = await main(teamList)
  res.json({
    result: 'server: assigned TSS teams to their starting buckets',
    writeResult,
  })
})
