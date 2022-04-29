import { https } from 'firebase-functions'
import { hasMissingKeys } from '../utils'
import { assignTSSTeams as keyCheck } from '../utils/keyChecks'

export const updatePageAccess = https.onRequest(async (req, res) => {
  const [err, status] = hasMissingKeys(keyCheck, req)
  if (status === 'missing') {
    res.json({ message: err })
    return
  }
  res.json({
    result: 'updated page access state!',
  })
})
