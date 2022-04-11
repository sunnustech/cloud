import { https } from 'firebase-functions'
import { firestore } from 'firebase-admin'
import { getAuth, UserRecord } from 'firebase-admin/auth'
import { WriteResult } from '@google-cloud/firestore'
import { initializeTeam } from './initializeTeam'

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
type AddUserRecord = {
  message: any
  status: 'fulfilled' | 'rejected'
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
  // var addResults: Promise<PromiseSettledResult<AddUserRecord>[]> = 1
  if (successfulUIDs.length > 0) {
    /* append new UIDs to list of all automatically generated users
     * (this allows them to be deleted easily by deleteAllUsers)
     */
    const docRef = firestore().collection('users').doc('allIds')
    docRef.set({
      data: firestore.FieldValue.arrayUnion(...successfulUIDs),
    })

    /* add successfully created users to their respective teams
     * 1. get list of existing team names
     *    - initialize if not exists
     * 2. append user to member array in that team using array union
     */

    const existingTeamNames: string[] = (
      await firestore().collection('teams').listDocuments()
    ).map((e) => e.id)

    const initializeStack: Promise<WriteResult>[] = []

    successfulUserList.forEach((user) => {
      if (!existingTeamNames.includes(user.teamName)) {
        // initialize a new team based on the user's teamName
        initializeStack.push(initializeTeam(user.teamName))
      }
    })

    await Promise.allSettled(initializeStack)
    const awaitStack: Promise<AddUserRecord>[] = []

    successfulUserList.forEach((user) => {
      awaitStack.push(addUserToTeam(user))
    })

    const asdf = await Promise.allSettled(awaitStack)
    console.log(asdf)

    // addResults = Promise.allSettled(awaitStack)
  }

  /* send back the statuses */
  res.json({
    fulfilled,
    rejected,
    successfulUserList,
    successfulUIDs,
  })
})

const addUserToTeam = async (user: User): Promise<AddUserRecord> => {
  console.log('got here')
  const existingTeamNames: string[] = (
    await firestore().collection('teams').listDocuments()
  ).map((e) => e.id)

  if (!existingTeamNames.includes(user.teamName)) {
    return {
      status: 'rejected',
      message: `Team ${user.teamName} does not exist. Please initialize it first.`,
    }
  }

  const docRef = firestore().collection('teams').doc(user.teamName)
  const data: User[] = (await docRef.get()).data()?.members

  if (!data) {
    return {
      status: 'rejected',
      message: `Internal server error: ${user.teamName} member array has an issue`,
    }
  }

  const existingUIDs = data.map((e) => e.uid)

  if (existingUIDs.includes(user.uid)) {
    return {
      status: 'rejected',
      message: `User ${user.email} is already in team ${user.teamName}.`,
    }
  }

  const writeResult = await docRef.set(
      {
        members: firestore.FieldValue.arrayUnion({
          email: user.email,
          loginId: 'something unique',
          phoneNumber: user.phoneNumber,
          uid: user.uid,
        }),
      },
      { merge: true }
  )
  return { message: writeResult, status: 'fulfilled' }
}
