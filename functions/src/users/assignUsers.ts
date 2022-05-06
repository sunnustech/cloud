import { https } from 'firebase-functions'
import { firestore } from 'firebase-admin'
import { WriteResult } from '@google-cloud/firestore'
import { hasMissingKeys } from '../utils/exits'
import { please as keyCheck } from '../utils/keyChecks'
import { User } from '../classes/user'
import { Team } from '../classes/team'
import { resultSummary } from '../utils/response'

export const assignUsers = https.onRequest(async (req, res) => {
  if (hasMissingKeys(keyCheck, req, res)) return

  const userCollection = firestore()
    .collection('users')
    .withConverter(User.converter)
  const teamCollection = firestore()
    .collection('teams')
    .withConverter(Team.converter)

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
