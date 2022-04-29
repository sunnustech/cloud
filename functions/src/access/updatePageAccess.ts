import { https } from 'firebase-functions'
import { hasMissingKeys } from '../utils'
import { updatePageAccess as keyCheck } from '../utils/keyChecks'

export const updatePageAccess = https.onRequest(async (req, res) => {
  if (hasMissingKeys(keyCheck, req, res)) return

  res.json({
    result: 'updated page access state!',
  })
})
