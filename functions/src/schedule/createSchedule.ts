import { https } from 'firebase-functions'
// import { firestore } from 'firebase-admin'
// import { getAuth, UserRecord } from 'firebase-admin/auth'
// import { WriteResult } from '@google-cloud/firestore'

export const createSchedule = https.onRequest(async (req, res) => {
  const requestKeys = Object.keys(req.body)

  /* check to see if userList is a property of the request body */
  if (!requestKeys.includes('scheduleConfig')) {
    res.json({
      keys: requestKeys,
      message: 'please supply a schedule config in the property "scheduleConfig"',
      data: req.body,
    })
    return
  }

  if (!requestKeys.includes('roundRobinConfig')) {
    res.json({
      keys: requestKeys,
      message: 'please supply a round robin config in the property "roundRobinConfig"',
      data: req.body,
    })
    return
  }

  /* send back the statuses */
  res.json({
    message: 'yeet'
  })
})
