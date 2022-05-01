import { getAuth } from 'firebase-admin/auth'
import { Sunnus } from '../classes'

/**
 * @param {Sunnus.User[]} users
 * @param {string[]} loginIds
 * @return {Promise<Sunnus.User>[]} queue that will create the users requested
 */
export function makeFirebaseUsers(
  users: Sunnus.User[],
  loginIds: string[]
): Promise<Sunnus.User>[] {
  const firebaseUserCreationQueue: Promise<Sunnus.User>[] = []
  users.forEach((user, index) => {
    user.setLoginId(loginIds[index])
    firebaseUserCreationQueue.push(
      getAuth()
        .createUser({
          email: user.email,
          emailVerified: false,
          password: 'sunnus',
          disabled: false,
        })
        .then((rec) => {
          user.setUid(rec.uid)
          return user
        })
    )
  })
  return firebaseUserCreationQueue
}
