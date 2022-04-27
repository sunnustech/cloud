import { https } from 'firebase-functions'

export const handleMatch = https.onRequest(async (req, res) => {
  res.json({
    result: 'Round robin handler at your service!',
  })
})
