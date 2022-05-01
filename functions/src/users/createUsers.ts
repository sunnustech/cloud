import { https } from 'firebase-functions'
import { createUsers as keyCheck } from '../utils/keyChecks'
import { createFirebaseUsers } from './firebase'
import { getUsersFromCsv, hasMissingHeaders } from '../utils/parseCsv'
import { hasMissingKeys } from '../utils/exits'
import { getAllExistingValues } from '../utils/firestore'
import { Sunnus } from '../classes'

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
  const userList: Sunnus.User[] = getUsersFromCsv(csv).filter(
    (user) => !already.exists(user.email)
  )

  const writeSummary = await createFirebaseUsers(userList)

  /* send back the statuses */
  res.json({ writeSummary })
  return
})
