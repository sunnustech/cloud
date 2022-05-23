import { https } from 'firebase-functions'
import { firestore } from 'firebase-admin'
import { IncomingHandleMatchRequest, ServerMatchRecord } from '../types'
import { DocumentData, DocumentReference } from '@google-cloud/firestore'

/**
 * Adds a document to the 'match-records' collection on an instance of the match outcome
 *
 * @param {IncomingHandleMatchRequest} data json request sent to cloud function
 * @return {Promise<DocumentReference<DocumentData>>} the outcome of writing to the collection 'match-records'
 */
const saveMatchRecordAsync = async (
  data: IncomingHandleMatchRequest
): Promise<DocumentReference<DocumentData>> => {
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
 * Updates the 'schedule' collection on the outcome of round robin matches
 * To update finals, semis, quarters, check out 'updateKnockoutTable'
 *
 * @param {IncomingHandleMatchRequest} data json request sent to cloud function
 * @return {Promise<WriteResult>} the outcome of updating the collection 'schedule'
 */
const updateMatchResult = async (
  data: IncomingHandleMatchRequest & { id: string }
): Promise<void> => {
  await firestore().collection('schedule').doc(data.id).update({
    scoreA: data.scoreA,
    scoreB: data.scoreB,
  })
}

/**
 * Endpoint to handle the outcome of a round robin match
 * Request body parameters:
 * Refer to the type IncomingHandleMatchRequest along with a document identifier id
 */
export const updateSchedule = https.onCall(
  async (req: IncomingHandleMatchRequest & { id: string }, _context) => {
    const results = await Promise.all([
      saveMatchRecordAsync(req),
      updateMatchResult(req),
    ])

    // Sends back a message that we've successfully written the match
    return {
      result: `Match with ID: ${results[0].id} written.`,
    }
  }
)
