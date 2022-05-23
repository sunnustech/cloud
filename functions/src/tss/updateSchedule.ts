import { https } from 'firebase-functions'
import { firestore } from 'firebase-admin'
import { IncomingHandleMatchRequest, ServerMatchRecord } from '../types'
// import { Round, Sport, Winner } from '../types/TSS'
import {
  DocumentData,
  DocumentReference,
} from '@google-cloud/firestore'

/**
 * Adds a document to the 'match-records' collection on an instance of the match outcome
 *
 * @param {IncomingHandleMatchRequest} data json request sent to cloud function
 * @return {Promise<DocumentReference<DocumentData>>} the outcome of writing to the collection 'match-records'
 */
const saveMatchRecordAsync = async (
  data: IncomingHandleMatchRequest
): Promise<DocumentReference<DocumentData>> => {
  // get timestamp from server
  const timestamp: Date = firestore.Timestamp.now().toDate()
  const serverMatchRecord: ServerMatchRecord = {
    ...data,
    timestamp,
  }

  const writeResult = await firestore()
    .collection('match-records')
    .add(serverMatchRecord)
  return writeResult
}

/**
 * Updates the 'tss' collection on the outcome of the match
 *
 * @param {IncomingHandleMatchRequest} data json request sent to cloud function
 * @return {Promise<WriteResult>} the outcome of updating the collection 'tss'
 */
const updateMatchResult = async (
  data: IncomingHandleMatchRequest & { id: string }
): Promise<void> => {
  // const scoreA: number = data.scoreA
  // const scoreB: number = data.scoreB
  // const winner: Winner = data.winner
  // const sport: Sport = data.sport
  // const round: Round = data.round
  // const matchNumber: number = data.matchNumber

  await firestore().collection('schedule').doc(data.id).update({
    scoreA: data.scoreA, scoreB: data.scoreB,
  })
  // const tssDoc = firestore().collection('TSS').doc(sport)

  // const path = round + '.' + matchNumber.toString()
  // const scoreAPath = path + '.' + 'scoreA'
  // const scoreBPath = path + '.' + 'scoreB'
  // const winnerPath = path + '.' + 'winner'
  //
  // const updatedObj: any = {}
  // updatedObj[scoreAPath] = scoreA
  // updatedObj[scoreBPath] = scoreB
  // updatedObj[winnerPath] = winner
  // return await tssDoc.update(updatedObj)
}

/**
 * Endpoint to handle the outcome of a round robin match
 * Request body parameters:
 * Refer to the type IncomingHandleMatchRequest
 */
export const updateSchedule = https.onCall(
  async (req: IncomingHandleMatchRequest & { id: string }, context) => {
    // TODO: use context to only allow uids that are inside of facils/admins
    const results = await Promise.all([
      saveMatchRecordAsync(req),
      updateMatchResult(req),
    ])

    // Send back a message that we've successfully written the match
    return {
      result: `Match with ID: ${results[0].id} written.`,
    }
  }
)
