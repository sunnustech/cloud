import { firestore } from 'firebase-admin'
import { https } from 'firebase-functions'
import { WriteResult } from '@google-cloud/firestore'

import { please as keyCheck } from '../utils/keyChecks'
import { hasMissingKeys } from '../utils/exits'

const collections: Record<string, string[]> = {
  shared: ['users', 'tssRoundRobinCache'],
  users: [],
  teams: [],
  schedule: [],
  notifications: [],
}

export const initializeCollections = https.onRequest(async (req, res) => {
  if (hasMissingKeys(keyCheck, req, res)) return
  const q: Promise<WriteResult>[] = []
  Object.keys(collections).forEach((name) => {
    const col = firestore().collection(name)
    const init = col.doc('---init---')
    q.push(init.create({ created: firestore.FieldValue.serverTimestamp() }))
    collections[name].forEach((name) => {
      const doc = col.doc(name)
      q.push(doc.create({ created: firestore.FieldValue.serverTimestamp() }))
    })
  })
  await Promise.allSettled(q)
  res.json({ message: 'initialized collection structure' })
})
