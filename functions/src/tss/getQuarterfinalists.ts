import { https } from 'firebase-functions'
import { Sport } from '../types'
import { hasMissingKeys } from '../utils'
import { firestore } from 'firebase-admin'
// import { WriteResult } from '@google-cloud/firestore'
// import { Sport } from '../types'
// import { DocumentData, DocumentReference } from '@google-cloud/firestore'
// import { sportList } from '../data/constants'
import { getQuarterfinalists as keyCheck } from '../utils/keyChecks'
import { PointsProps } from './updatePoints'
import { shuffle } from '../utils/team'

type PointsPropsWithName = PointsProps & {
  teamName: string
}

async function checkRoundRobinCompleted(sport: Sport): Promise<boolean> {
  const scheduleCollection = firestore().collection('schedule')
  const query = scheduleCollection.where('sport', '==', sport)
  const snapshot = await query.get()
  const allDone: boolean[] = []
  snapshot.forEach((doc) => {
    const data = doc.data()
    allDone.push(data.completed)
  })
  return allDone.every((e) => e === true)
}

async function getGroupTable(sport: Sport): Promise<PointsPropsWithName[]> {
  const pointsCollection = firestore().collection('points')
  const query = pointsCollection.where('sport', '==', sport)
  const snapshot = await query.get()
  const groupTable: PointsPropsWithName[] = []
  snapshot.forEach((doc) => {
    const data = doc.data()
    groupTable.push({
      teamName: doc.id,
      total: data.total,
      scored: data.scored,
      conceded: data.conceded,
      difference: data.difference,
      group: data.group,
      sport: data.sport,
    })
  })
  return groupTable
}

function getRandomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * max)
}

function derange(a: string[]) {
  const o = [...a]
  const n = a.length
  let j;
  for (let i = 0; i < n - 1; i++) {
    do {
      j = getRandomInt(i, n-1)
    } while (a[j] == o[i])
    ;[a[i], a[j]] = [a[j], a[i]]
  }
}

export const getQuarterfinalists = https.onRequest(async (req, res) => {
  const [err, status] = hasMissingKeys(keyCheck, req)
  if (status === 'missing') {
    res.json({ message: err })
    return
  }
  const sportList = req.body.sportList

  // try with volleyball first
  const sport = 'volleyball'

  // get all documents in collection "schedule" that are from volleyball
  // to check that all matches have been played
  const roundRobinCompleted = await checkRoundRobinCompleted(sport)
  if (!roundRobinCompleted) {
    res.json({
      result: `${sport}'s round robin stage still not completed yet.`,
    })
    return
  }

  // with round robin completed
  // get all documents in collection "points" that are from volleyball
  const groupTable: PointsPropsWithName[] = await getGroupTable(sport)

  const groupLetters = ['A', 'B', 'C', 'D']

  const by =
    (
      field: 'total' | 'difference' | 'scored',
      direction: 'ascending' | 'descending'
    ) =>
    (a: PointsPropsWithName, b: PointsPropsWithName) => {
      const [A, B] = [a[field], b[field]]
      if (A === B) {
        return 0
      } else if (A < B) {
        return direction === 'ascending' ? -1 : 1
      } else {
        return direction === 'ascending' ? 1 : -1
      }
    }

  const quarterfinalists: string[] = []

  const firsts: string[] = []
  const seconds: string[] = []

  groupLetters.forEach((letter) => {
    const group = groupTable.filter((x) => x.group === letter)
    // since js sort is stable sort, the last sort takes greatest precedence
    group.sort(by('scored', 'descending'))
    group.sort(by('difference', 'descending'))
    group.sort(by('total', 'descending'))
    console.log(group.map((x) => x.teamName))
    firsts.push(group[0].teamName)
    seconds.push(group[1].teamName)
  })

  derange(firsts)
  derange(seconds)

  for (let i = 0; i < 4; i++) {
    quarterfinalists.push(firsts[i], seconds[i])
  }

  console.log(quarterfinalists)

  // and read them into 4 arrays, one for each group
  // get the top two scorers from each group
  // tiebreak using goal difference
  //
  // shuffle the order
  // and return an ordrered array of length 8.
  // [GOAL]
  //
  // merge it with current knockout table
  res.json({
    result: `sent ${sportList}'s top 2 from each group to quarterfinals!`,
  })
})
