import { https } from 'firebase-functions'
import { firestore } from 'firebase-admin'
import { WriteResult } from '@google-cloud/firestore'
import { hasMissingKeys } from '../utils/exits'
import { please as keyCheck } from '../utils/keyChecks'
import { resultSummary } from '../utils/response'
import { converter } from '../classes/firebase'

export const assignUsers = https.onRequest(async (req, res) => {
  if (hasMissingKeys(keyCheck, req, res)) return

  const userCollection = firestore()
    .collection('users')
    .withConverter(converter.user)
  const teamCollection = firestore()
    .collection('teams')
    .withConverter(converter.team)

  const users = await userCollection.get()
  const assignQueue: Promise<WriteResult>[] = []

  users.forEach((doc) => {
    const user = doc.data()
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

  const writeResults = resultSummary(await Promise.allSettled(assignQueue))

  /* send back the statuses */
  res.json({ message: 'assigning users...', writeResults })
})
