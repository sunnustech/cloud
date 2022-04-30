import { getAuth } from 'firebase-admin/auth'
import { Sunnus } from '../classes'
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
 * @param {InitializeUser[]} users: the incoming request array of users
 * new users will be added to
 * @param {string[]} loginIds
 * @return {UserCreationQueueResult} a queue that can be executed to create
 * the users requested
 */
export function makeFirebaseUsers(
  users: Sunnus.User[],
  loginIds: string[]
): Promise<Sunnus.User>[] {
  const firebaseUserCreationQueue: Promise<Sunnus.User>[] = []
  users.forEach((user, index) => {
    const id = loginIds[index]
    firebaseUserCreationQueue.push(
      getAuth()
        .createUser(makeFirebaseUser(user, id))
        .then((rec) => {
          user.setUid(rec.uid)
          user.setLoginId(id)
          return user
        })
    )
  })
  return firebaseUserCreationQueue
}
