import { https } from 'firebase-functions'
// import { InitializeTeam } from '../types/sunnus-init'
// import { firestore } from 'firebase-admin'
// import { WriteResult } from '@google-cloud/firestore'
import { assignTSSTeams as keyCheck } from '../utils/keyChecks'
import { hasMissingKeys } from '../utils'

export const assignTSSTeams = https.onRequest(async (req, res) => {
  const [err, status] = hasMissingKeys(keyCheck, req)
  if (status === 'missing') {
    res.json({ message: err })
    return
  }

  res.json({
    result: 'server: assigned TSS teams to their starting buckets',
  })
})
