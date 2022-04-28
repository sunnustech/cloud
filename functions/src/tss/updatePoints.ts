import { https } from 'firebase-functions'
import { firestore } from 'firebase-admin'
import { WriteResult } from '@google-cloud/firestore'
import { Sport } from '../types'
import { DocumentData, DocumentReference } from '@google-cloud/firestore'
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

  const completedMatches = await fetchCompletedMatches()
  const points: Record<string, [Sport, Group, number]> = {}

  // init zero point list
  const tempTeamList: [Sport, Group, string][] = []
  completedMatches.forEach((match) => {
    tempTeamList.push([match.sport, match.group, match.A])
    tempTeamList.push([match.sport, match.group, match.B])
  })
  const teamList: [Sport, Group, string][] = [...new Set(tempTeamList)]
  teamList.forEach((e) => {
    points[e[2]] = [e[0], e[1], 0]
  })

  completedMatches.forEach((match) => {
    // handle draw
    if (match.scoreA === match.scoreB) {
      points[match.A][2] += 1
      points[match.B][2] += 1
    }
    // handle win
    else if (match.scoreA > match.scoreB) {
      // A wins
      points[match.A][2] += 3
    } else {
      // B wins
      points[match.B][2] += 3
    }
  })

  // write the points to database (full overwrite, since it reads all completed matches)
  const pointsCollection = firestore().collection('points')
  const docRefs: Record<string, DocumentReference<DocumentData>> = {}
  sportList.forEach((sport) => (docRefs[sport] = pointsCollection.doc(sport)))
  const awaitStack: Promise<WriteResult>[] = []

  // iterate through list of teamNames
  teamList
    .map((x) => x[2])
    .forEach((teamName) => {
      const [sport, group, point] = points[teamName]
      console.log(sport, group, point, teamName)
      awaitStack.push(
        pointsCollection
          .doc(sport)
          .set({ [group]: { [teamName]: point } }, { merge: true })
      )
    })
  const writeResult = await Promise.allSettled(awaitStack)

  res.json({
    result: `updated tss points!`,
    points,
    writeResult,
  })
})
