import { https } from 'firebase-functions'
import { FirebaseUser } from '../types/users'
// import { firestore } from 'firebase-admin'
import { getAuth, UserRecord } from 'firebase-admin/auth'

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

  const userList: FirebaseUser[] = req.body.userList
  const awaitStack: Promise<UserRecord>[] = []

  userList.forEach((user) => {
    awaitStack.push(
      getAuth().createUser({
        email: user.email,
        emailVerified: false,
        password: 'sunnus',
        disabled: false,
      })
    )
  })

  /* await all to settle, regardless of success or failture
   * #leavenomanbehind
   */
  const results = await Promise.allSettled(awaitStack)

  /* split the successes from the failures */
  const fulfilled = results.filter((result) => result.status === 'fulfilled')
  const rejected = results.filter((result) => result.status === 'rejected')

  /* add the successful ones to SunNUS user database */

  /* send back the statuses */
  res.json({ fulfilled, rejected })
})
