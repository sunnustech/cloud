import { https } from 'firebase-functions'
import { firestore } from 'firebase-admin'
import { IncomingHandleMatchRequest, ServerMatchRecord } from '../types'
import { Round } from '../types/TSS'
import { roundList } from '../data/constants'

/**
 * Transitions teams to the next round. If team is in final, it has no more
 * rounds and thus ends.
 *
 * @param {IncomingHandleMatchRequest} data json request sent to cloud function
 * @return {Round} next round that the team will be in
 */
const getNextRound = (data: IncomingHandleMatchRequest): Round => {
  const curr = roundList.indexOf(data.round)
  const next = curr + 1
  return next < roundList.length ?
    roundList[next] :
    roundList[roundList.length - 1]
}

/**
 * Computes the match number for the next bracket
 *
 * @param {IncomingHandleMatchRequest} data json request sent to cloud function
 * @return {number} match number team is in for next bracket
 */
const getNextMatchNumber = (data: IncomingHandleMatchRequest) => {
  return Math.floor(data.matchNumber / 2)
}

/**
 * Returns the winner's team name
 *
 * @param {IncomingHandleMatchRequest} data json request sent to cloud function
 * @return {string} name of team that is advancing into the next bracket
 */
const getWinnerTeamName = (data: IncomingHandleMatchRequest) => {
  if (data.winner === 'U') {
    return '---'
  }
  return data.winner === 'A' ? data.A : data.B
}

/**
 * Determines if the winner should be team A or team B for the next bracket
 *
 * @param {IncomingHandleMatchRequest} data json request sent to cloud function
 * @return {"A" | "B"} letter mapping of winning team for next bracket
 */
const getNextSlot = (data: IncomingHandleMatchRequest): 'A' | 'B' => {
  return data.matchNumber % 2 === 0 ? 'A' : 'B'
}

/**
 * Adds a document to the 'match-records' collection on an instance of the match outcome
 *
 * @param {IncomingHandleMatchRequest} data json request sent to cloud function
 * @return {Promise<DocumentReference<DocumentData>>} the outcome of writing to the collection 'match-records'
 */
const saveMatchRecordAsync = async (data: IncomingHandleMatchRequest) => {
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
 * Updates the 'tss' collection in the database for the outcome of finals, semis, quarters
 * To update round robin matches, check out 'updateScedule'
 *
 * @param {IncomingHandleMatchRequest} data json request sent to cloud function
 * @return {string} outcome as a status update
 */
const updateKnockoutTable = async (
  data: IncomingHandleMatchRequest
): Promise<string> => {
  const nextRound: Round = getNextRound(data)
  const nextMatchNumber = getNextMatchNumber(data)
  const nextSlot: 'A' | 'B' = getNextSlot(data)
  const winnerTeamName = getWinnerTeamName(data)

  const docRef = firestore().collection('TSS').doc(data.sport)

  const thisRoundData = {
    [data.matchNumber]: {
      winner: data.winner,
      scoreA: data.scoreA,
      scoreB: data.scoreB,
    },
  }

  // If the round is finals, we only need to update this round as there is no next round
  if (data.round === 'finals') {
    docRef.set(
      {
        [data.round]: thisRoundData,
        champions: winnerTeamName,
      },
      { merge: true }
    )
    return 'updated: finals'
  }

  // For any other round,
  // we need to update the winner of current and next round
  const nextRoundData = {
    [nextMatchNumber]: {
      winner: 'U',
      [nextSlot]: winnerTeamName,
    },
  }

  docRef.set(
    {
      [data.round]: thisRoundData,
      [nextRound]: nextRoundData,
    },
    { merge: true }
  )
  return 'updated: non-finals'
}

/**
 * Endpoint to handle the outcome of a match
 * Request body parameters:
 * Refer to the type IncomingHandleMatchRequest
 */
export const handleMatch = https.onCall(
  async (req: IncomingHandleMatchRequest, _context) => {
    if (req.scoreA === req.scoreB) {
      return {
        result: 'Draws are not accepted.',
        status: 'rejected',
      }
    }
    if (req.A === '' || req.B === '') {
      return {
        result: 'One or none of the teams are in the round yet.',
        status: 'rejected',
      }
    }
    const results = await Promise.all([
      saveMatchRecordAsync(req),
      updateKnockoutTable(req),
    ])

    // Sends back a message that we've successfully written the match
    return {
      result: `Match with ID: ${results[0].id} written.`,
      status: 'fulfilled',
    }
  }
)
