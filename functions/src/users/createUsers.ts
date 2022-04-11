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
    /* append new UIDs to list of all automatically generated users
     * (this allows them to be deleted easily by deleteAllUsers)
     */
    const docRef = firestore().collection('users').doc('allIds')
    docRef.set({ data: firestore.FieldValue.arrayUnion(...successfulUIDs) })

    /* add successfully created users to their respective teams
     * 1. get list of existing team names
     *    - initialize if not exists
     * 2. append user to member array in that team using array union
     */

    const existingTeamNames: string[] = (
      await firestore().collection('teams').listDocuments()
    ).map((e) => e.id)
    res.json({ existingTeamNames: existingTeamNames })
    return
  }

  /* send back the statuses */
  res.json({ fulfilled, rejected, successfulUserList, successfulUIDs })
})
