import { https } from 'firebase-functions'
import { firestore } from 'firebase-admin'
import { WriteResult } from '@google-cloud/firestore'

export const deleteDocs = https.onRequest(async (req, res) => {
  const requestKeys = Object.keys(req.body)
  const has = (e: string) => requestKeys.includes(e)

  /* check to see if userList is a property of the request body */
  if (!has('collection') || !has('docList')) {
    res.json({
      keys: requestKeys,
      message:
        'please supply both a collection name and a list of documents to delete',
      data: req.body,
    })
    return
  }

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
