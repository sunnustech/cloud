import { https } from 'firebase-functions'
import { firestore } from 'firebase-admin'
import { IncomingHandleMatchRequest, ServerMatchRecord } from '../types'
import { Round, Sport, Winner } from '../types/TSS'

const saveMatchRecordAsync = async (data: IncomingHandleMatchRequest) => {
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
 * Determines the winner of a match based on the scores
 *
 * @param scoreA score that team A receives
 * @param scoreB score that team B receives
 * @returns winner of the match
 */
const getWinner = (scoreA: number, scoreB: number) => {
  if (scoreA > scoreB) {
    return 'A'
  } else if (scoreA < scoreB) {
    return 'B'
  } else {
    return 'D'
  }
}

/**
 * Updates the 'tss' collection on the outcome of the match
 *
 * @param data json request sent to cloud function
 * @returns
 */
const updateMatchResult = async (data: IncomingHandleMatchRequest) => {
  const teamA: string = data.A
  const teamB: string = data.B
  const scoreA: number = data.scoreA
  const scoreB: number = data.scoreB
  const winner: Winner = getWinner(scoreA, scoreB)
  const sport: Sport = data.sport
  const round: Round = data.round

  const tssDoc = firestore().collection('TSS').doc(sport)
  // Insert this into frontend, and test
  console.log()
}

/**
const nextRound: Round = getNextRound(data)
  const nextMatchNumber = getNextMatchNumber(data)
  const nextSlot: 'A' | 'B' = getNextSlot(data)
  const winnerTeamName = getWinnerTeamName(data)

  const docRef = firestore().collection(data.series).doc(data.sport)

  const thisRoundData = {
    [data.matchNumber]: {
      winner: data.winner,
      scoreA: data.scoreA,
      scoreB: data.scoreB,
    },
  }

  // If the round is finals, we only need to update this round
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
 */

/* 
Sample call:
const request: IncomingHandleMatchRequest = {
  series: 'TSS',
  sport: 'volleyball',
  round: 'round_robin',
  matchNumber: 0,
  A: 'A-team',
  B: 'B-team',
  winner: 'A',
  scoreA: 10,
  scoreB: 4,
  facilitatorEmail: 'hongsheng@gmail.com',
}
*/

export const handleMatch = https.onCall(
  async (req: IncomingHandleMatchRequest, context) => {
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
