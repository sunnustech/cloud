import { https } from 'firebase-functions'
import { firestore } from 'firebase-admin'
import { HandleMatchRequest } from '@/types/index'

export const handleMatch = https.onRequest(async (req, res) => {
  // sample match request
  const request: HandleMatchRequest = {
    sport: 'volleyball',
    matchNumber: 0,
    round: 'round_of_32',
    match: {
      A: 'A-team',
      B: 'B-team',
      winner: 'A',
      scoreA: 10,
      scoreB: 4,
    },
    facilitatorEmail: 'hongsheng@gmail.com',
  }

  // get timestamp from server
  const timestamp: Date = firestore.Timestamp.now().toDate()

  // Push the new message into Firestore
  const writeResult = await firestore()
    .collection('cloud-matches')
    .add({
      ...request,
      timestamp,
    })

  // Send back a message that we've successfully written the match
  res.json({ result: `Match with ID: ${writeResult.id} written.` })
})
