import { https } from 'firebase-functions'
import { Event, RoundRobinConfig, ScheduleConfig } from '../types/schedule'
import { hasMissingKeys } from '../utils'
import { createSchedule as keyCheck } from '../utils/keyChecks'
import { makeSchedule } from './makeSchedule'
// import { firestore } from 'firebase-admin'
// import { getAuth, UserRecord } from 'firebase-admin/auth'
// import { WriteResult } from '@google-cloud/firestore'

export const createSchedule = https.onRequest(async (req, res) => {
  const [err, status] = hasMissingKeys(keyCheck, req)
  if (status === 'missing') {
    res.json({ message: err })
    return
  }
  const sc: ScheduleConfig = req.body.scheduleConfig
  const rr: RoundRobinConfig = req.body.roundRobinConfig

  const schedule: Event[] = makeSchedule(sc, rr)

  console.log(schedule)

  /* send back the statuses */
  res.json({
    message: 'yeet',
  })
})
