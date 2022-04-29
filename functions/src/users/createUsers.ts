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
   * add a user to the successfulUserList
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
   * into successfulUserList
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

export const createUsers = https.onRequest(async (req, res) => {
  if (hasMissingKeys(keyCheck, req, res)) return

  const userListCsvString = req.body.userListCsvString
  const headers = getCsvHeadersFromString(userListCsvString)
  console.debug(headers)

  const insufficientHeaders = !isSubset(
    ['teamName', 'email', 'phoneNumber'],
    headers,
    'Check that the headers contain all of: teamName, email, phoneNumber',
    res
  )
  if (insufficientHeaders) return

  const userList = getUsersFromCsv(req.body.userListCsvString)

  const freshLoginIds = await makeLoginIdList(userList.length)

  /* this queue creates Firebase email-password users */

  const [successfulUserList, userCreationQueue] = getUserCreationQueue(
    userList,
    freshLoginIds
  )

  /* await all to settle, regardless of success or failure
   * #leavenomanbehind
   */
  const results = await Promise.allSettled(userCreationQueue)

  /* split the successes from the failures */
  const fulfilled = results.filter((result) => result.status === 'fulfilled')
  const rejected = results.filter((result) => result.status === 'rejected')

  /* add the successful ones to SunNUS user database */
  const successfulUIDs = successfulUserList.map((user) => user.uid)
  const successfulLoginIds = successfulUserList.map(
    (user) => user.loginIdNumber
  )

  const usersCollection = firestore().collection('users')
  const allUsersData = usersCollection.doc('allUsersData')
  allUsersData.update({
    uidList: firestore.FieldValue.arrayUnion(...successfulUIDs),
    loginIdList: firestore.FieldValue.arrayUnion(...successfulLoginIds),
  })
  allUsersData.update({
    uidList: firestore.FieldValue.arrayRemove(''),
  })

  const setUserQueue: Promise<WriteResult>[] = []

  successfulUserList.forEach((user) => {
    const uid = user.uid
    const userDocument = usersCollection.doc(uid)
    setUserQueue.push(userDocument.set(user))
  })

  const userWriteResult = await Promise.allSettled(setUserQueue)

  /* send back the statuses */
  res.json({
    fulfilled,
    rejected,
    successfulUserList,
    successfulUIDs,
    userWriteResult,
  })
})
