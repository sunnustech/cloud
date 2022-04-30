import { https } from 'firebase-functions'
import { getFreshLoginIds } from '../utils/user'
import { createUsers as keyCheck } from '../utils/keyChecks'
import { makeFirebaseUsers } from './firebase'
import { getUsersFromCsv, hasMissingHeaders } from '../utils/parseCsv'
import { hasMissingKeys } from '../utils/exits'
import { getAllExistingValues } from '../utils/firestore'
import { Sunnus } from '../classes'
import { resultSummary } from '../utils/response'

/**
 * creates firebase users
 * a by-product is that all users will automatically be assigned a unique UID
 * @param {InitializeUser[]} users
 * @return {Promise<CreateFirebaseUsersResult>}
 */
const createFirebaseUsers = async (
  users: Sunnus.User[]
): Promise<{ fulfilled: number; rejected: number }> => {
  const freshLoginIds = await getFreshLoginIds(users.length)
  /* creates Firebase email-password users */
  const q = makeFirebaseUsers(users, freshLoginIds)
  const summary = resultSummary(await Promise.allSettled(q))
  return summary
}

//TODO : replace this with a Cloud Trigger function
// async function updateUserMeta(
//   createdUsers: User[],
//   meta: DocumentReference<DocumentData>
// ) {
//   const UIDs = createdUsers.map((user) => user.uid)
//   const loginIdNumbers = createdUsers.map((user) => user.loginIdNumber)
//   const emails = createdUsers.map((user) => user.realEmail)
//   const fv = firestore.FieldValue
//
//   // add uids of artificially created users to be able to delete them later
//   await meta.update({
//     uidList: fv.arrayUnion(...UIDs),
//     loginIdList: fv.arrayUnion(...loginIdNumbers),
//     emailList: fv.arrayUnion(...emails),
//   })
//   await meta.update({ uidList: fv.arrayRemove('') })
// }

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

  if (userList.length === 0) {
    res.json({ message: 'No new users created.' })
    return
  }

  const writeSummary = await createFirebaseUsers(userList)

  /* send back the statuses */
  res.json({ writeSummary })
  return
})

// export const createAdmins = https.onRequest(async (req, res) => {
//   if (hasMissingKeys(keyCheck, req, res)) return
//   const userListCsvString = req.body.userListCsvString
//   const headers = getCsvHeadersFromString(userListCsvString)
//   const insufficientHeaders = !isSubset(
//     [
//       'teamName',
//       'email',
//       'phoneNumber',
//       'admin',
//       'TSSOfficial',
//       'TSSVolunteer',
//       'SOARFacilitator',
//     ],
//     headers,
//     'Check to make sure you have all the required headers.',
//     res
//   )
//   if (insufficientHeaders) return
//   const rawUserList: InitializeUser[] = getUsersFromCsv(
//     req.body.userListCsvString
//   )
//
//   /* get existing list of emails
//    * reject any readEmails that are already in that list
//    * const [fulfilled, rejected] = partition(userList, () => true)
//    */
//   const existingEmails = await getAllExistingValues('users', 'email')
//   const userList = rawUserList.filter(() => true)
//   console.log(existingEmails)
//
//   if (userList.length === 0) {
//     res.json({
//       message: 'No new users created.',
//     })
//     return
//   }
//
//   const firebaseResult = await createFirebaseUsers(userList)
//   const createdUsers = firebaseResult.createdUsers
//   const sunnusResult = await createSunnusUsers(createdUsers)
//
//   /* send back the statuses */
//   res.json({
//     createdUsers,
//     firebaseWriteResult: firebaseResult.writeResult,
//     sunnusWriteResult: sunnusResult,
//   })
// })
