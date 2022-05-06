import { firestore } from 'firebase-admin'
import typedTSS from './schema/TSS'
import typedSOAR from './schema/SOAR'
import { https } from 'firebase-functions'
import { WriteResult } from '@google-cloud/firestore'
// import writeUserList from './schema/users'

/**
 * @param {Object} props: the input
 * @param {boolean} props.force: set to true to overwrite indiscriminately
 * @param {string} props.collection: the target firebase collection
 * @param {Record<string, Record<string, any>>} props.docs: the docs to write
 * Note: firebase doesn't handle special characters well as keys.
 * so we will be uniquely identifying users by the UID instead.
 */
async function push({
  force = false,
  collection,
  docs,
}: {
  force?: boolean
  collection: string
  docs: Record<string, Record<string, any>>
}) {
  const collectionRef = firestore().collection(collection)
  const docKeys = Object.keys(docs)

  const awaitStack: Promise<WriteResult>[] = []
  if (force) {
    docKeys.forEach((docKey) => {
      awaitStack.push(collectionRef.doc(docKey).set(docs[docKey]))
    })
  } else {
    docKeys.forEach((docKey) => {
      awaitStack.push(collectionRef.doc(docKey).update(docs[docKey]))
    })
  }

  await Promise.all(awaitStack)
}

export const writeSchema = https.onRequest(async (_, res) => {
  const everything = await Promise.all([
    push({
      force: true,
      collection: 'SOAR',
      docs: typedSOAR,
    }),
    push({
      force: true,
      collection: 'TSS',
      docs: typedTSS,
    }),
  ])

  res.json({ result: `Probably worked: ${everything}` })
})
