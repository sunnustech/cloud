import { firestore } from 'firebase-admin'
import { https } from 'firebase-functions'
import { WriteResult } from '@google-cloud/firestore'

import { please as keyCheck } from '../utils/keyChecks'
import { hasMissingKeys } from '../utils/exits'

export const initializeCollections = https.onRequest(async (req, res) => {
  if (hasMissingKeys(keyCheck, req, res)) return
  const collections: string[] = [
    'shared',
    'users',
    'teams',
    'schedule',
    'notifications',
  ]
  const q: Record<string, Promise<WriteResult>[]> = {
    create: [],
    yeet: [],
  }
  collections.forEach((name) => {
    const doc = firestore().collection(name).doc()
    q.create.push(
      doc.create({
        type: 'initialization',
        message:
          'By-product of initializing the database. Nothing to see here.',
        important: 'I use Arch btw.',
      })
    )
    q.yeet.push(doc.delete())
  })
  const r: Record<string, PromiseSettledResult<WriteResult>[]> = {
    create: [],
    yeet: [],
  }
  r.create = await Promise.allSettled(q.create)
  // r.yeet = await Promise.allSettled(q.yeet)
  res.json({ message: 'initialized collection structure' })
})
