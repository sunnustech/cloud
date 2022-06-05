import { https } from 'firebase-functions'
import { hasMissingKeys } from '../utils/exits'
import { updatePageAccess as keyCheck } from '../utils/keyChecks'

/**
 * Updates list of pages that a user can see for authentication purposes
 */
export const updatePageAccess = https.onRequest(async (req, res) => {
  if (hasMissingKeys(keyCheck, req, res)) return

  res.json({
    result: 'updated page access state!',
  })
})
