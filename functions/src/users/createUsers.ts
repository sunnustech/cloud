import { https } from 'firebase-functions'
import { firestore } from 'firebase-admin'
import { UserRecord } from 'firebase-admin/auth'
import { InitializeUser } from '../types/sunnus-init'
import { User } from '../types/sunnus-firestore'
import { WriteResult } from '@google-cloud/firestore'
import { getFreshLoginIds } from '../utils/user'
import { createUsers as keyCheck } from '../utils/keyChecks'
import { getUserCreationQueue } from './firebase'
import { getCsvHeadersFromString, getUsersFromCsv } from '../utils/parseCsv'
import { DocumentData, DocumentReference } from '@google-cloud/firestore'
import { isSubset, hasMissingKeys } from '../utils/exits'
// import { partition } from '../utils/array'
import { getExistingDict } from '../utils/firestore'

type CreateFirebaseUsersResult = {
  writeResult: PromiseSettledResult<UserRecord>[]
  createdUsers: User[]
}

type CreateSunnusUsersResult = Promise<PromiseSettledResult<WriteResult>[]>

/**
 * creates firebase users
 * a by-product is that all users will automatically be assigned a unique UID
 * @param {InitializeUser[]} users
 * @return {Promise<CreateFirebaseUsersResult>}
 */
const createFirebaseUsers = async (
  users: InitializeUser[]
): Promise<CreateFirebaseUsersResult> => {
  const freshLoginIds = await getFreshLoginIds(users.length)
  /* this queue creates Firebase email-password users */
  // const [createdUsers, userCreationQueue] = getUserCreationQueue(users, freshLoginIds)
  const result = getUserCreationQueue(users, freshLoginIds)
  /* await all to settle, regardless of success or failure
   * #leavenomanbehind
   */
  const writeResult = await Promise.allSettled(result.userCreationQueue)
  return {
    writeResult,
    createdUsers: result.createdUsers,
  }
}

async function updateUserMeta(
  createdUsers: User[],
  meta: DocumentReference<DocumentData>
) {
  const UIDs = createdUsers.map((user) => user.uid)
  const loginIdNumbers = createdUsers.map((user) => user.loginIdNumber)
  const emails = createdUsers.map((user) => user.realEmail)
  const fv = firestore.FieldValue

  // add uids of artificially created users to be able to delete them later
  await meta.update({
    uidList: fv.arrayUnion(...UIDs),
    loginIdList: fv.arrayUnion(...loginIdNumbers),
    emailList: fv.arrayUnion(...emails),
  })
  await meta.update({ uidList: fv.arrayRemove('') })
}

/**
 * creates sunnus users.
 * since firebase doesn't support natively implemented users to have extra
 * attributes, we will write the required attributes to the database.
 * @param {User[]} createdUsers
 * @return {CreateSunnusUsersResult}
 */
const createSunnusUsers = async (
  createdUsers: User[]
): CreateSunnusUsersResult => {
  // get reference to collection
  const usersCollection = firestore().collection('users')
  const allUsersData = usersCollection.doc('allUsersData')
  await updateUserMeta(createdUsers, allUsersData)

  const q: Promise<WriteResult>[] = createdUsers.map((user) => {
    const uid = user.uid
    const userDocument = usersCollection.doc(uid)
    return userDocument.set(user)
  })
  const result = await Promise.allSettled(q)
  return result
}

export const createUsers = https.onRequest(async (req, res) => {
  if (hasMissingKeys(keyCheck, req, res)) return
  const userListCsvString = req.body.userListCsvString
  const headers = getCsvHeadersFromString(userListCsvString)
  const insufficientHeaders = !isSubset(
    ['teamName', 'email', 'phoneNumber'],
    headers,
    'Check that the headers contain all of: teamName, email, phoneNumber',
    res
  )
  if (insufficientHeaders) return
  const rawUserList: InitializeUser[] = getUsersFromCsv(
    req.body.userListCsvString
  )

  /* get existing list of emails
   * reject any readEmails that are already in that list
   * const [fulfilled, rejected] = partition(userList, () => true)
   */
  const existingEmails = await getExistingDict('users', 'allUsersData', 'emailList')
  const userList = rawUserList.filter(
    (user) => existingEmails[user.email] !== true
  )

  if (userList.length === 0) {
    res.json({
      message: "No new users created."
    })
    return
  }

  const firebaseResult = await createFirebaseUsers(userList)
  const createdUsers = firebaseResult.createdUsers
  const sunnusResult = await createSunnusUsers(createdUsers)

  /* send back the statuses */
  res.json({
    createdUsers,
    firebaseWriteResult: firebaseResult.writeResult,
    sunnusWriteResult: sunnusResult,
  })
})

export const createAdmins = https.onRequest(async (req, res) => {
  if (hasMissingKeys(keyCheck, req, res)) return
  const userListCsvString = req.body.userListCsvString
  const headers = getCsvHeadersFromString(userListCsvString)
  const insufficientHeaders = !isSubset(
    [
      'teamName',
      'email',
      'phoneNumber',
      'admin',
      'TSSOfficial',
      'TSSVolunteer',
      'SOARFacilitator',
    ],
    headers,
    'Check to make sure you have all the required headers.',
    res
  )
  if (insufficientHeaders) return
  const rawUserList: InitializeUser[] = getUsersFromCsv(req.body.userListCsvString)

  /* get existing list of emails
   * reject any readEmails that are already in that list
   * const [fulfilled, rejected] = partition(userList, () => true)
   */
  const existingEmails = await getExistingDict('users', 'allUsersData', 'emailList')
  const userList = rawUserList.filter(
    (user) => existingEmails[user.email] !== true
  )

  if (userList.length === 0) {
    res.json({
      message: "No new users created."
    })
    return
  }

  const firebaseResult = await createFirebaseUsers(userList)
  const createdUsers = firebaseResult.createdUsers
  const sunnusResult = await createSunnusUsers(createdUsers)

  /* send back the statuses */
  res.json({
    createdUsers,
    firebaseWriteResult: firebaseResult.writeResult,
    sunnusWriteResult: sunnusResult,
  })
})
