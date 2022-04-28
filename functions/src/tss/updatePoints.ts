import { https } from 'firebase-functions'
import { firestore } from 'firebase-admin'
import { WriteResult } from '@google-cloud/firestore'
import { Sport } from '../types'
import { DocumentData, DocumentReference } from '@google-cloud/firestore'
import { sportList } from '../data/constants'

type CompletedMatch = {
  A: string
  B: string
  scoreA: number
  scoreB: number
  sport: Sport
}

async function fetchCompletedMatches(): Promise<CompletedMatch[]> {
  const scheduleCollection = firestore().collection('schedule')
  const query = scheduleCollection.where('completed', '==', true)
  const snapshot = await query.get()
  const completedMatches: CompletedMatch[] = []
  snapshot.forEach((doc) => {
    const data = doc.data()
    completedMatches.push({
      A: data.A,
      B: data.B,
      scoreA: data.scoreA,
      scoreB: data.scoreB,
      sport: data.sport,
    })
  })
  return completedMatches
}

export const updatePoints = https.onRequest(async (req, res) => {
  // read the entire schedule for completed matches
  // extract winners / drawers from each match
  // store them on a local dictionary Record<string, number> sorted by sport
  // give winners 3 points, drawers 1 point
  // make a reference to their document in collection.teams
  // write them

  const completedMatches = await fetchCompletedMatches()

  const points: Record<Sport, Record<string, number>> = {
    dodgeball: {},
    frisbee: {},
    volleyball: {},
    tchoukball: {},
    touchRugby: {},
    captainsBall: {},
  }

  // init zero point list
  const tempTeamList: [Sport, string][] = []
  completedMatches.forEach((match) => {
    tempTeamList.push([match.sport, match.A])
    tempTeamList.push([match.sport, match.B])
  })
  const teamList: [Sport, string][] = [...new Set(tempTeamList)]
  teamList.forEach((e) => {
    points[e[0]][e[1]] = 0
  })

  completedMatches.forEach((match) => {
    const data = points[match.sport]
    // handle draw
    if (match.scoreA === match.scoreB) {
      data[match.A] += 1
      data[match.B] += 1
    }
    // handle win
    else if (match.scoreA > match.scoreB) {
      // A wins
      data[match.A] += 3
    } else {
      // B wins
      data[match.B] += 3
    }
  })

  // write the points to database (full overwrite, since it reads all completed matches)
  const pointsCollection = firestore().collection('points')
  const docRefs: Record<string, DocumentReference<DocumentData>> = {}
  sportList.forEach((sport) => (docRefs[sport] = pointsCollection.doc(sport)))
  const awaitStack: Promise<WriteResult>[] = []
  sportList.forEach((sport) => {
    const data = points[sport]
    const teamNames: string[] = Object.keys(data)
    teamNames.forEach((teamName) => {
      awaitStack.push(docRefs[sport].update({ [teamName]: data[teamName] }))
    })
  })
  const writeResult = await Promise.allSettled(awaitStack)

  res.json({
    result: `updated tss points!`,
    points,
    writeResult,
  })
})
