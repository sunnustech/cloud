import { https } from 'firebase-functions'

export const pageAccess = https.onRequest(async (_, res) => {
  // don't take a request body
  res.json({
    result: 'you can see all pages',
  })
})
