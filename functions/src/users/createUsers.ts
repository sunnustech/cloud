import { createUsers as keyCheck } from '../utils/keyChecks'
import { createFirebaseUsers } from './firebase'
import { getUsersFromCsv, hasMissingHeaders } from '../utils/parseCsv'
import { hasMissingKeys } from '../utils/exits'
import { getAllExistingValues } from '../utils/firestore'
import { sunnus } from '../classes'
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
  const userList: sunnus.User[] = getUsersFromCsv(csv).filter(
    (user) => !already.exists(user.email)
  )

  const writeSummary = await createFirebaseUsers(userList)
  const userCollection = firestore().collection('users')

  const q: Promise<WriteResult>[] = []
  userList.forEach((user) => {
    q.push(
      userCollection
        .doc(user.uid)
        .withConverter(sunnus.User.converter)
        .set(user)
    )
  })
  const result = await Promise.all(q)

  /* send back the statuses */
  res.json({ writeSummary, result })
  return
})
