import { https } from 'firebase-functions'

/**
 * Tests to see if a user can see all pages, as some users have restricted access
 */
export const pageAccess = https.onRequest(async (_, res) => {
  // don't take a request body
  res.json({
    result: 'you can see all pages',
  })
})
