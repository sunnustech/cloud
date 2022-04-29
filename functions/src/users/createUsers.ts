import { https } from 'firebase-functions'
import { firestore } from 'firebase-admin'
import { getAuth, UserRecord } from 'firebase-admin/auth'
import { InitializeUser } from '../types/sunnus-init'
import { User } from '../types/sunnus-firestore'
import { WriteResult } from '@google-cloud/firestore'
import { makeLoginIdList } from '../utils/user'
import { createUsers as keyCheck } from '../utils/keyChecks'
import { makeFirebaseUser } from './makeFirebaseUser'
import { getCsvHeadersFromString, getUsersFromCsv } from '../utils/parseCsv'
import { isSubset, hasMissingKeys } from '../utils/exits'

type CreateFirebaseUsersResult = {
  writeResult: PromiseSettledResult<UserRecord>[]
  createdUsers: User[]
}

type CreateSunnusUsersResult = Promise<PromiseSettledResult<WriteResult>[]>

/**
 * @param {InitializeUser[]} userList: the incoming request array of users
 * new users will be added to
 * @param {string[]} freshLoginIds: a list of existing login ids
 * @return {Promise<UserRecord>[]} a queue that can be executed to create
 * the users requested
 */
const getUserCreationQueue = (
  userList: InitializeUser[],
  freshLoginIds: string[]
): [User[], Promise<UserRecord>[]] => {
  const successList: User[] = []
  const userCreationQueue: Promise<UserRecord>[] = []
  /**
   * add a user to the createdUsers
   * @param {InitializeUser} user: requested props
   * @param {number} index
   * @param {UserRecord} rec: the assgined props after user creation
   * @return {UserRecord} bypass the callback
   */
  function appendSuccessfulAddition(
    user: InitializeUser,
    index: number,
    rec: UserRecord
  ): UserRecord {
    const loginIdNumber = freshLoginIds[index]
    const loginId = `${user.teamName}${loginIdNumber}`
    const email = `${loginId}@sunnus.com`
    successList.push({
      uid: rec.uid,
      phoneNumber: user.phoneNumber,
      realEmail: user.email,
      teamName: user.teamName,
      email,
      loginId,
      loginIdNumber,
    })
    return rec
  }
  /* create a queue of user creation commands if that
   * command succeeds in execution later, save that user
   * into createdUsers
   */
  userList.forEach((user, index) => {
    userCreationQueue.push(
      getAuth()
        .createUser(makeFirebaseUser(user, freshLoginIds[index]))
        .then((rec) => appendSuccessfulAddition(user, index, rec))
    )
  })
  return [successList, userCreationQueue]
}

/**
 * creates firebase users
 * a by-product is that all users will automatically be assigned a unique UID
 * @param {InitializeUser[]} userList
 * @returns {Promise<CreateFirebaseUsersResult>}
 */
const createFirebaseUsers = async (
  userList: InitializeUser[]
): Promise<CreateFirebaseUsersResult> => {
  const freshLoginIds = await makeLoginIdList(userList.length)
  /* this queue creates Firebase email-password users */
  const [createdUsers, userCreationQueue] = getUserCreationQueue(
    userList,
    freshLoginIds
  )
  /* await all to settle, regardless of success or failure
   * #leavenomanbehind
   */
  const writeResult = await Promise.allSettled(userCreationQueue)
  return {
    writeResult,
    createdUsers,
  }
}

/**
 * creates sunnus users.
 * since firebase doesn't support natively implemented users to have extra
 * attributes, we will write the required attributes to the database.
 * @param {User[]} createdUsers
 * @returns {CreateSunnusUsersResult}
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
