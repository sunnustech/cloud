import { https } from 'firebase-functions'
import { firestore } from 'firebase-admin'
import { IncomingHandleMatchRequest, ServerMatchRecord } from '@/types/index'

const saveMatchRecordAsync = async (data: IncomingHandleMatchRequest) => {
  // get timestamp from server
  const timestamp: Date = firestore.Timestamp.now().toDate()
  const serverMatchRecord: ServerMatchRecord = { ...data, timestamp }

  const writeResult = await firestore()
    .collection('match-records')
    .add(serverMatchRecord)
  return writeResult
}

const updateKnockoutTable = async (data: IncomingHandleMatchRequest) => {
  const writeResult = await firestore().collection('match-records').add(data)
  return writeResult
}

export const handleMatch = https.onRequest(async (req, res) => {
  // sample match request
  const request: IncomingHandleMatchRequest = {
    sport: 'volleyball',
    matchNumber: 0,
    round: 'round_of_32',
    A: 'A-team',
    B: 'B-team',
    winner: 'A',
    scoreA: 10,
    scoreB: 4,
    facilitatorEmail: 'hongsheng@gmail.com',
  }

  const [writeResult] = await Promise.all([saveMatchRecordAsync(request)])

  // Send back a message that we've successfully written the match
  res.json({ result: `Match with ID: ${writeResult.id} written.` })
})
