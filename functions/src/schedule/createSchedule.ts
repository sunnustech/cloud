import { https } from 'firebase-functions'
import { Sport } from '../types/schedule'
import { hasMissingKeys } from '../utils'
// import { firestore } from 'firebase-admin'
// import { getAuth, UserRecord } from 'firebase-admin/auth'
// import { WriteResult } from '@google-cloud/firestore'

const sports: Sport[] = [
  'touchRugby',
  'dodgeball',
  'frisbee',
  'tchoukball',
  'volleyball',
  'captainsBall',
]

console.log(sports)

const keyCheck = [
  [
    'scheduleConfig',
    'please supply a schedule config in the property "scheduleConfig"',
  ],
  [
    'roundRobinConfig',
    'please supply a round robin config in the property "roundRobinConfig"',
  ],
]

export const createSchedule = https.onRequest(async (req, res) => {
  const [err, status] = hasMissingKeys(keyCheck, req)
  if (status === 'missing') {
    res.json({ message: err })
    return
  }

  console.log('not supposed to be here')

  /* send back the statuses */
  res.json({
    message: 'yeet',
  })
})
