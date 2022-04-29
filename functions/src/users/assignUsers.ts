import { https } from 'firebase-functions'
import { firestore } from 'firebase-admin'
import { WriteResult } from '@google-cloud/firestore'
import { partition } from '../utils/array'
import { hasMissingKeys } from '../utils/exits'
import { please as keyCheck } from '../utils/keyChecks'

export const assignUsers = https.onRequest(async (req, res) => {
  if (hasMissingKeys(keyCheck, req, res)) return

  const userCollection = firestore().collection('users')
  const teamCollection = firestore().collection('teams')

  const users = await userCollection.get()
  const assignQueue: Promise<WriteResult>[] = []

  users.forEach((doc) => {
    const d = doc.data()
    const user = { teamName: d.teamName, uid: d.uid }
    // skip if no teamName
    if (!user.teamName) {
      return
    }
    const teamDoc = teamCollection.doc(user.teamName)
    assignQueue.push(
      teamDoc.update({
        members: firestore.FieldValue.arrayUnion(user.uid),
      })
    )
  })

  const writeResults = await Promise.allSettled(assignQueue)

  const [fulfilled, rejected] = partition(
    writeResults,
    (result) => result.status === 'fulfilled'
  )

  /* send back the statuses */
  res.json({ message: '[WIP] assigning users...', fulfilled, rejected })
})
