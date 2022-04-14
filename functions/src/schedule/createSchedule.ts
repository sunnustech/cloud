import { https } from 'firebase-functions'
import { Sport } from '../types/schedule'
import { hasMissingKeys } from '../utils'
import { createSchedule as keyCheck } from '../utils/keyChecks'
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

export const createSchedule = https.onRequest(async (req, res) => {
  const [err, status] = hasMissingKeys(keyCheck, req)
  if (status === 'missing') {
    res.json({ message: err })
    return
  }

  console.log(sports)

  /* send back the statuses */
  res.json({
    message: 'yeet',
  })
})
