import { getAuth } from 'firebase-admin/auth'
import { getFreshLoginIds } from '../utils/user'
import { ResultSummary, resultSummary } from '../utils/response'
import { User } from '../classes/user'

/**
 * Creates firebase users (uid will be auto-generatered)
 *
 * @param {InitializeUser[]} users
 * @return {Promise<ResultSummary>}
 */
export const createFirebaseUsers = async (
  users: User[]
): Promise<ResultSummary> => {
  if (users.length === 0) {
    return { fulfilled: 0, rejected: 0 }
  }
  const freshLoginIds = await getFreshLoginIds(users.length)
  const queue: Promise<User>[] = []
  users.forEach((user, index) => {
    user.setLoginId(freshLoginIds[index])
    queue.push(
      getAuth()
        .createUser({
          // creates the firebase user
          email: user.email,
          emailVerified: false,
          password: 'sunnus',
          disabled: false,
        })
        .then((rec) => {
          // saves the auto-generatered uid
          user.setUid(rec.uid)
          return user
        }).catch((user) => {
          console.log(user, 'failed')
          return user
        })
    )
  })
  return resultSummary(await Promise.allSettled(queue))
}
