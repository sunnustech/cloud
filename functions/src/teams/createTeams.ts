import { https } from 'firebase-functions'

export const createTeams = https.onRequest(async (req, res) => {
  res.json({
    result: `Round robin handler at your service!`,
  })
})
