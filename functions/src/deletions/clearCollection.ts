import { https } from 'firebase-functions'
import { firestore } from 'firebase-admin'
import { WriteResult } from '@google-cloud/firestore'
import { clearCollection as keyCheck } from '../utils/keyChecks'
import { hasMissingKeys } from '../utils/exits'

export const clearCollection = https.onRequest(async (req, res) => {
  if (hasMissingKeys(keyCheck, req, res)) return

  const whitelist: string[] = req.body.whitelist || []

  const collectionRef = firestore().collection(req.body.collection)
  const docList: string[] = []
  const docRefList = await collectionRef.listDocuments()
  docRefList.forEach((doc) => {
    const id = doc.id
    if (!whitelist.includes(id)) {
      docList.push(doc.id)
    }
  })

  const removeDocQueue: Promise<WriteResult>[] = []
  docList.forEach((doc) => {
    if (whitelist.includes(doc)) {
      return
    }
    const removeDoc = collectionRef.doc(doc)
    removeDocQueue.push(removeDoc.delete())
  })

  const removeResult = await Promise.allSettled(removeDocQueue)

  res.json({
    removeResult,
  })
})
