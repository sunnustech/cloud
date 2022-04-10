import { firestore } from 'firebase-admin'
import typedParticipants from './schema/participants'
import typedTSS from './schema/TSS'
import typedSOAR from './schema/SOAR'
import typedRoles from './schema/roles'
import { https } from 'firebase-functions/v1'

/**
 * @param {string} collection: the target firebase collection
 * @param {Record<string, Record<string, any>>} docs: the docs to write
 */
async function push({
  collection,
  docs,
}: {
  collection: string
  docs: Record<string, Record<string, any>>
}) {
  const collectionRef = firestore().collection(collection)
  const docKeys = Object.keys(docs)

  const awaitStack = docKeys.map((docKey) => {
    collectionRef.doc(docKey).update(docs[docKey])
  })

  await Promise.all(awaitStack)
}

export const writeSchema = https.onRequest(async (_, res) => {
  const everything = await Promise.all([
    push({ collection: 'participants', docs: typedParticipants }),
    push({ collection: 'SOAR', docs: typedSOAR }),
    push({ collection: 'TSS', docs: typedTSS }),
    push({ collection: 'roles', docs: typedRoles }),
  ])

  res.json({ result: `Probably worked: ${everything}` })
})
