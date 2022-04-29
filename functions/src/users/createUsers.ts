import { https } from 'firebase-functions'
import { firestore } from 'firebase-admin'
import { getAuth, UserRecord } from 'firebase-admin/auth'
import { InitializeUser, InitializeFirebaseUser } from '../types/sunnus-init'
import { User } from '../types/sunnus-firestore'
import { WriteResult } from '@google-cloud/firestore'
import { makeLoginIdList } from '../utils/user'
import { createUsers as keyCheck } from '../utils/keyChecks'
import { hasMissingKeys } from '../utils'

/**
 * @param {InitializeUser[]} userList: the incoming request array of users
 * @param {User[]} successList: the list that successfully created new
 * users will be added to
 * @param {string[]} freshLoginIds: a list of existing login ids
 * @return {Promise<UserRecord>[]} a queue that can be executed to create
 * the users requested
 */
const getUserCreationQueue = (
  userList: InitializeUser[],
  successList: User[],
  freshLoginIds: string[]
): Promise<UserRecord>[] => {
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

  /**
   * takes a InitializeUser and adds basic information
   * for firebase to be able to create a full user
   * @param {InitializeUser} user: requested props
   * @param {number} index
   * @return {InitializeFirebaseUser}
   */
  function newUser(
    user: InitializeUser,
    index: number
  ): InitializeFirebaseUser {
    const loginIdNumber = freshLoginIds[index]
    const loginId = `${user.teamName}${loginIdNumber}`
    const email = `${loginId}@sunnus.com`
    return {
      email,
      emailVerified: false,
      password: 'sunnus',
      disabled: false,
    }
  }

  /* create a queue of user creation commands if that
   * command succeeds in execution later, save that user
   * into successfulUserList
   */
  userList.forEach((user, index) => {
    userCreationQueue.push(
      getAuth()
        .createUser(newUser(user, index))
        .then((rec) => appendSuccessfulAddition(user, index, rec))
    )
  })

  return userCreationQueue
}

export const createUsers = https.onRequest(async (req, res) => {
  if (hasMissingKeys(keyCheck, req, res)) return

  const userList: InitializeUser[] = req.body.userList
  const successfulUserList: User[] = []

  // const sharedCollection = firestore().collection('shared')
  // const loginIdsDoc = sharedCollection.doc('loginIds')
  const usersCollection = firestore().collection('users')
  const allUsersData = usersCollection.doc('allUsersData')

  /* get list of all existing loginIds */
  const existingLoginIds: string[] =
    (await allUsersData.get()).data()?.loginIdList || []
  const freshLoginIds = makeLoginIdList(userList.length, existingLoginIds)

  /* this queue creates Firebase email-password users */
  const userCreationQueue = getUserCreationQueue(
    userList,
    successfulUserList,
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
