import { https } from 'firebase-functions'
// import { firestore } from 'firebase-admin'

export const updatePoints = https.onRequest(async (req, res) => {
  res.json({
    result: `updated tss points!`,
  })
})
