import { https } from 'firebase-functions'
import { firestore } from 'firebase-admin'
import {
  WriteResult,
  DocumentData,
  DocumentReference,
} from '@google-cloud/firestore'
import { Sport } from '../types/TSS'
import { sportList } from '../data/constants'

type Group = string
type CompletedMatch = {
  group: Group
  A: string
  B: string
  scoreA: number
  scoreB: number
  sport: Sport
}
type TeamName = string
export type PointsProps = {
  total: number
  scored: number
  conceded: number
  difference: number
  group: string
  sport: string
}
type Points = Record<TeamName, PointsProps>

async function fetchCompletedMatches(): Promise<CompletedMatch[]> {
  const scheduleCollection = firestore().collection('schedule')
  const query = scheduleCollection.where('completed', '==', true)
  const snapshot = await query.get()
  const completedMatches: CompletedMatch[] = []
  snapshot.forEach((doc) => {
    const data = doc.data()
    completedMatches.push({
      group: data.group,
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

  const completedMatches: CompletedMatch[] = await fetchCompletedMatches()
  const points: Points = {}

  // get a list of unique tuples: (team name, sport, group)
  const tempTeamNames: TeamName[] = []
  completedMatches.forEach((match) => {
    tempTeamNames.push(match.A, match.B)
  })
  const teamNames: TeamName[] = [...new Set(tempTeamNames)]

  // initialize empty datasets for each team
  teamNames.forEach((teamName) => {
    points[teamName] = {
      total: 0,
      scored: 0,
      conceded: 0,
      difference: 0,
      group: '',
      sport: '',
    }
  })

  completedMatches.forEach((match) => {
    // append neutral data
    points[match.A].sport = match.sport
    points[match.B].sport = match.sport
    points[match.A].group = match.group
    points[match.B].group = match.group
    // append stats
    points[match.A].scored += match.scoreA
    points[match.B].scored += match.scoreB
    points[match.A].conceded += match.scoreB
    points[match.B].conceded += match.scoreA
    if (match.scoreA === match.scoreB) {
      // handle draw
      points[match.A].total += 1
      points[match.B].total += 1
    } else if (match.scoreA > match.scoreB) {
      // handle win
      // A wins
      points[match.A].total += 3
    } else {
      // B wins
      points[match.B].total += 3
    }
  })

  // calculate point difference
  teamNames.forEach((teamName) => {
    const data = points[teamName]
    data.difference = data.scored - data.conceded
  })

  // write the points to database (full overwrite, since it reads all completed matches)
  const pointsCollection = firestore().collection('points')
  const docRefs: Record<string, DocumentReference<DocumentData>> = {}
  sportList.forEach((sport) => (docRefs[sport] = pointsCollection.doc(sport)))
  const awaitStack: Promise<WriteResult>[] = []

  // iterate through list of teamNames and write
  teamNames.forEach((teamName) => {
    awaitStack.push(pointsCollection.doc(teamName).set(points[teamName]))
  })
  const writeResult = await Promise.allSettled(awaitStack)

  res.json({
    result: 'updated tss points!',
    points,
    writeResult,
  })
})
