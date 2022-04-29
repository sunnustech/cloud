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
import { isSubset, hasMissingKeys } from '../utils/exits'

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
  const createdUIDs = createdUsers.map((user) => user.uid)
  const createdLoginIdNumbers = createdUsers.map((user) => user.loginIdNumber)
  // get reference to collection
  const usersCollection = firestore().collection('users')
  const allUsersData = usersCollection.doc('allUsersData')
  const fv = firestore.FieldValue
  // add uids of artificially created users to be able to delete them later
  allUsersData.update({
    uidList: fv.arrayUnion(...createdUIDs),
    loginIdList: fv.arrayUnion(...createdLoginIdNumbers),
  })
  allUsersData.update({ uidList: fv.arrayRemove('') })
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
  const userList: InitializeUser[] = getUsersFromCsv(req.body.userListCsvString)

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
