import { https } from 'firebase-functions'
import { hasMissingKeys } from '../utils/exits'
import { getSchedule as keyCheck } from '../utils/keyChecks'
import { firestore } from 'firebase-admin'
import { DocumentData, Query } from '@google-cloud/firestore'

export const getSchedule = https.onRequest(async (req, res) => {
  const result: DocumentData[] = []
  if (hasMissingKeys(keyCheck, req, res)) return
  const scheduleCollection = firestore().collection('schedule')
  const filter = req.body.filter
  const pairs = Object.entries(filter)

  if (pairs.length === 0) {
    const snapshot = await scheduleCollection.get()
    snapshot.forEach((doc) => {
      const data = doc.data()
      result.push(data)
    })
    res.json({
      message: 'emtpy filter, returning entire schedule',
      result,
    })
    return
  }

  let query: Query<DocumentData> = scheduleCollection.where(
    pairs[0][0],
    '==',
    pairs[0][1]
  )

  for (let i = 1; i < pairs.length; i++) {
    const [key, value] = pairs[i]
    query = query.where(key, '==', value)
  }

  const snapshot = await query.get()

  snapshot.forEach((doc) => {
    const data = doc.data()
    result.push(data)
  })

  /* send back the statuses */
  res.json({
    message: 'enjoy',
    result,
  })
})
