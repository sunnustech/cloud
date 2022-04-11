import { https } from 'firebase-functions'
import { firestore } from 'firebase-admin'
import { getAuth, UserRecord } from 'firebase-admin/auth'

// import { User } from '../types/users'
type RequestUser = {
  email: string
  phoneNumber: string
  teamName: string
}
type User = {
  email: string
  phoneNumber: string
  teamName: string
  uid: string
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
  const awaitStack: Promise<UserRecord>[] = []

  const successfulUserList: User[] = []

  userList.forEach((user) => {
    awaitStack.push(
      getAuth()
        .createUser({
          email: user.email,
          emailVerified: false,
          password: 'sunnus',
          disabled: false,
        })
        .then((userRecord) => {
          successfulUserList.push({
            uid: userRecord.uid,
            phoneNumber: user.phoneNumber,
            email: user.email,
            teamName: user.teamName,
          })
          return userRecord
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
  const successfulUIDs = successfulUserList.map((user) => user.uid)
  if (successfulUIDs.length > 0) {
    const docRef = firestore().collection('users').doc('allIds')
    docRef.set({ data: firestore.FieldValue.arrayUnion(...successfulUIDs) })
  }

  /* send back the statuses */
  res.json({ fulfilled, rejected, successfulUserList, successfulUIDs })
})
