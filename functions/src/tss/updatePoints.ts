import { https } from 'firebase-functions'
import { firestore } from 'firebase-admin'

type CompletedMatch = {
  A: string
  B: string
  scoreA: number
  scoreB: number
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

  res.json({
    result: `updated tss points!`,
    completedMatches,
  })
})
