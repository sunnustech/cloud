import { https } from 'firebase-functions'
import { getFreshLoginIds } from '../utils/user'
import { createUsers as keyCheck } from '../utils/keyChecks'
import { makeFirebaseUsers } from './firebase'
import { getUsersFromCsv, hasMissingHeaders } from '../utils/parseCsv'
import { hasMissingKeys } from '../utils/exits'
import { getAllExistingValues } from '../utils/firestore'
import { Sunnus } from '../classes'
import { ResultSummary, resultSummary } from '../utils/response'

/**
 * creates firebase users (uid will be auto-generatered)
 * @param {InitializeUser[]} users
 * @return {Promise<ResultSummary>}
 */
const createFirebaseUsers = async (
  users: Sunnus.User[]
): Promise<ResultSummary> => {
  if (users.length === 0) {
    return { fulfilled: 0, rejected: 0 }
  }
  const freshLoginIds = await getFreshLoginIds(users.length)
  /* creates Firebase email-password users */
  const q = makeFirebaseUsers(users, freshLoginIds)
  const summary = resultSummary(await Promise.allSettled(q))
  return summary
}

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
