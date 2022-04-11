import { https } from 'firebase-functions'
import { firestore } from 'firebase-admin'
import {
  IncomingHandleMatchRequest,
  Round,
  ServerMatchRecord,
} from '../types/index'
import { roundList } from '../data/constants'

/**
 * Transitions teams to the next round. If team is in final, it has no more
 * rounds and thus ends.
 * @param {IncomingHandleMatchRequest} data: the entire match request
 * @return {Round} Next round that the team will be in
 */
const getNextRound = (data: IncomingHandleMatchRequest): Round => {
  const curr = roundList.indexOf(data.round)
  const next = curr + 1
  return next < roundList.length ?
    roundList[next] :
    roundList[roundList.length - 1]
}

const getNextMatchNumber = (data: IncomingHandleMatchRequest) => {
  return Math.floor(data.matchNumber / 2)
}

const getWinnerTeamName = (data: IncomingHandleMatchRequest) => {
  if (data.winner === 'U') {
    return '---'
  }
  return data[data.winner]
}

const getNextSlot = (data: IncomingHandleMatchRequest) => {
  return data.matchNumber % 2 === 0 ? 'A' : 'B'
}

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

const updateKnockoutTable = async (data: IncomingHandleMatchRequest) => {
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
}

export const _handleMatch = https.onRequest(async (req, res) => {
  // sample match request
  const request: IncomingHandleMatchRequest = {
    series: 'TSS',
    sport: 'volleyball',
    round: 'round_of_32',
    matchNumber: 0,
    A: 'A-team',
    B: 'B-team',
    winner: 'A',
    scoreA: 10,
    scoreB: 4,
    facilitatorEmail: 'hongsheng@gmail.com',
  }

  const [saveResult, writeResult] = await Promise.all([
    saveMatchRecordAsync(request),
    updateKnockoutTable(request),
  ])

  // Send back a message that we've successfully written the match
  res.json({
    result: `Match with ID: ${saveResult.id} written.`,
  })
  res.json({ result: `${writeResult} successfully` })
})

export const handleMatch = https.onCall(
    async (req: IncomingHandleMatchRequest, context) => {
    // TODO: use context to only allow uids that are inside of facils/admins
      const results = await Promise.all([
        saveMatchRecordAsync(req),
        updateKnockoutTable(req),
      ])

      // Send back a message that we've successfully written the match
      return {
        result: `Match with ID: ${results[0].id} written.`,
      }
    }
)