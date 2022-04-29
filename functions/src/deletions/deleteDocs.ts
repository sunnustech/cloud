import { https } from 'firebase-functions'
import { firestore } from 'firebase-admin'
import { WriteResult } from '@google-cloud/firestore'
import { hasMissingKeys } from '../utils/exits'
import { deleteDocs as keyCheck } from '../utils/keyChecks'

export const deleteDocs = https.onRequest(async (req, res) => {
  if (hasMissingKeys(keyCheck, req, res)) return

  const collectionRef = firestore().collection(req.body.collection)
  const docList: string[] = req.body.docList

  const removeDocQueue: Promise<WriteResult>[] = []
  docList.forEach((doc) => {
    const removeDoc = collectionRef.doc(doc)
    removeDocQueue.push(removeDoc.delete())
  })

  const removeResult = await Promise.allSettled(removeDocQueue)

  res.json({
    removeResult,
  })
})
