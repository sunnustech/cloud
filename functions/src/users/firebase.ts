import { getAuth, UserRecord } from 'firebase-admin/auth'
import { User } from '../types/sunnus-firestore'
import { InitializeFirebaseUser, InitializeUser } from '../types/sunnus-init'

/**
 * takes a InitializeUser and adds basic information
 * for firebase to be able to create a full user
 * @param {InitializeUser} user: requested props
 * @param {string} loginIdNumber
 * @return {InitializeFirebaseUser}
 */
function makeFirebaseUser(
  user: InitializeUser,
  loginIdNumber: string
): InitializeFirebaseUser {
  const loginId = `${user.teamName}${loginIdNumber}`
  const email = `${loginId}@sunnus.com`
  return {
    email,
    emailVerified: false,
    password: 'sunnus',
    disabled: false,
  }
}

/**
 * @param {InitializeUser} user: requested props
 * @param {string} loginIdNumber
 * @param {UserRecord} rec: the assgined props after user creation
 * @return {UserRecord} bypass the callback
 */
function appendSuccessfulAddition(
  user: InitializeUser,
  loginIdNumber: string,
  rec: UserRecord,
  successList: User[]
): UserRecord {
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
 * @param {InitializeUser[]} users: the incoming request array of users
 * new users will be added to
 * @param {string[]} loginIds
 * @return {Promise<UserRecord>[]} a queue that can be executed to create
 * the users requested
 */
export function getUserCreationQueue(
  users: InitializeUser[],
  loginIds: string[]
): [User[], Promise<UserRecord>[]] {
  const successList: User[] = []
  const userCreationQueue: Promise<UserRecord>[] = []
  /* create a queue of user creation commands if that
   * command succeeds in execution later, save that user
   * into createdUsers
   */
  users.forEach((user, index) => {
    userCreationQueue.push(
      getAuth()
        .createUser(makeFirebaseUser(user, loginIds[index]))
        .then((rec) =>
          appendSuccessfulAddition(user, loginIds[index], rec, successList)
        )
    )
  })
  return [successList, userCreationQueue]
}
