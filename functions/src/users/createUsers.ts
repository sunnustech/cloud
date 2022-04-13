import { https } from 'firebase-functions'
import { firestore } from 'firebase-admin'
import { getAuth, UserRecord } from 'firebase-admin/auth'
import { RequestUser, FirebaseUserInit } from '../types/users'
import { User } from '../types/sunnus-firestore'
import { WriteResult } from '@google-cloud/firestore'

/**
 * @param {RequestUser[]} userList: the incoming request array of users
 * @param {User[]} successList: the list that successfully created new
 * users will be added to
 * @return {Promise<UserRecord>[]} a queue that can be executed to create
 * the users requested
 */
const getUserCreationQueue = (
    userList: RequestUser[],
    successList: User[]
): Promise<UserRecord>[] => {
  const userCreationQueue: Promise<UserRecord>[] = []

  /**
   * add a user to the successfulUserList
   * @param {RequestUser} user: requested props
   * @param {UserRecord} rec: the assgined props after user creation
   * @return {UserRecord} bypass the callback
   */
  function appendSuccessfulAddition(
      user: RequestUser,
      rec: UserRecord
  ): UserRecord {
    successList.push({
      uid: rec.uid,
      phoneNumber: user.phoneNumber,
      email: user.email,
      teamName: user.teamName,
      loginId: `${user.teamName}123456`,
    })
    return rec
  }

  /**
   * takes a RequestUser and adds basic information
   * for firebase to be able to create a full user
   * @param {RequestUser} user: requested props
   * @return {FirebaseUserInit}
   */
  function newUser(user: RequestUser): FirebaseUserInit {
    return {
      email: user.email,
      emailVerified: false,
      password: 'sunnus',
      disabled: false,
    }
  }

  /* create a queue of user creation commands if that
   * command succeeds in execution later, save that user
   * into successfulUserList
   */
  userList.forEach((user) => {
    userCreationQueue.push(
        getAuth()
            .createUser(newUser(user))
            .then((rec) => appendSuccessfulAddition(user, rec))
    )
  })

  return userCreationQueue
}

export const createUsers = https.onRequest(async (req, res) => {
  const requestKeys = Object.keys(req.body)

  /* check to see if userList is a property of the request body */
  if (!requestKeys.includes('userList')) {
    res.json({
      keys: requestKeys,
      message: 'please supply a list of users in the property "userList"',
      data: req.body,
    })
    return
  }

  const userList: RequestUser[] = req.body.userList
  const successfulUserList: User[] = []

  /* this queue creates Firebase email-password users */
  const userCreationQueue = getUserCreationQueue(userList, successfulUserList)

  /* await all to settle, regardless of success or failure
   * #leavenomanbehind
   */
  const results = await Promise.allSettled(userCreationQueue)

  /* split the successes from the failures */
  const fulfilled = results.filter((result) => result.status === 'fulfilled')
  const rejected = results.filter((result) => result.status === 'rejected')

  /* add the successful ones to SunNUS user database */
  const successfulUIDs = successfulUserList.map((user) => user.uid)
  // var addResults: Promise<PromiseSettledResult<AddUserRecord>[]> = 1

  if (successfulUIDs.length === 0) {
    /* no new users were created,
     * so no need to handle team assignment
     */
    res.json({
      fulfilled,
      rejected,
      successfulUserList,
      successfulUIDs,
    })
    return
  }

  /* append new UIDs to list of all automatically generated users
   * (this allows them to be deleted easily by deleteAllUsers)
   */
  const userCollection = firestore().collection('users')
  const allIdsDoc = userCollection.doc('allIds')
  allIdsDoc.set({
    data: firestore.FieldValue.arrayUnion(...successfulUIDs),
  })

  const setUserQueue: Promise<WriteResult>[] = []

  successfulUserList.forEach((user) => {
    const uid = user.uid
    const userDocument = userCollection.doc(uid)
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
