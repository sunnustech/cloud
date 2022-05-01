import { createUsers as keyCheck } from '../utils/keyChecks'
import { createFirebaseUsers } from './firebase'
import { getUsersFromCsv, hasMissingHeaders } from '../utils/parseCsv'
import { hasMissingKeys } from '../utils/exits'
import { getAllExistingValues } from '../utils/firestore'
import { User } from '../classes/user'
import { https } from 'firebase-functions'
import { WriteResult } from '@google-cloud/firestore'
import { firestore } from 'firebase-admin'

export const createUsers = https.onRequest(async (req, res) => {
  // check keys
  if (hasMissingKeys(keyCheck, req, res)) return

  // check csv headers
  const csv = req.body.userListCsvString
  const required = ['teamName', 'email', 'phoneNumber']
  if (hasMissingHeaders(required, csv, res)) return

  /* get existing list of emails */
  const already = await getAllExistingValues('users', 'email')

  /* get list of new users to make */
  const userList: User[] = getUsersFromCsv(csv).filter(
    (user) => !already.exists(user.email)
  )

  const writeSummary = await createFirebaseUsers(userList)
  const userCollection = firestore()
    .collection('users')
    .withConverter(User.converter)

  // write the user data to collections
  const q: Promise<WriteResult>[] = []
  userList.forEach((user) => {
    q.push(userCollection.doc(user.uid).set(user))
  })
  await Promise.all(q) // only returns writeTime, nothing to capture here

  /* send back the statuses */
  res.json({ writeSummary })
  return
})
