import { https } from 'firebase-functions'
import { firestore } from 'firebase-admin'
import { getAuth, UserRecord } from 'firebase-admin/auth'
import { WriteResult } from '@google-cloud/firestore'
import { initializeTeam } from './initializeTeam'
import {
  RequestUser,
  User,
  Member,
  AddUserRecord,
  FirebaseUserInit,
} from '../types/users'

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

export const createUsersAndAddToTeams = https.onRequest(async (req, res) => {
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
  const allIdsDoc = firestore().collection('users').doc('allIds')
  allIdsDoc.set({
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

  const initializeQueue: Promise<WriteResult>[] = []

  const allRequestedTeamNames: string[] = successfulUserList.map(
      (user) => user.teamName
  )
  const uniqueRequestedTeamNames: string[] = [...new Set(allRequestedTeamNames)]

  uniqueRequestedTeamNames.forEach((teamName) => {
    if (!existingTeamNames.includes(teamName)) {
      initializeQueue.push(initializeTeam(teamName))
    }
  })

  /* execute all team initializations */
  const initializeResult = await Promise.allSettled(initializeQueue)
  console.log(initializeResult)

  /* team names after initializing */
  const postInitializationTeamNames: string[] = (
    await firestore().collection('teams').listDocuments()
  ).map((e) => e.id)

  const teamAssignmentQueue: Promise<AddUserRecord>[] = []

  successfulUserList.forEach((user) => {
    teamAssignmentQueue.push(addUserToTeam(user, postInitializationTeamNames))
  })

  /* execute all user-to-team assignments */
  const teamAssignmentResult = await Promise.allSettled(teamAssignmentQueue)
  console.log(teamAssignmentResult)

  const teamsAfterWriting = await firestore().collection('teams').get()

  const editedTeams: Record<string, Member[]> = {}
  teamsAfterWriting.forEach((teamDoc) => {
    const data = teamDoc.data()
    const teamName = data.teamName
    if (!allRequestedTeamNames.includes(teamName)) {
      return
    }
    const members = data.members
    editedTeams[teamName] = members
  })

  console.log(editedTeams)

  /* send back the statuses */
  res.json({
    fulfilled,
    rejected,
    successfulUserList,
    successfulUIDs,
    editedTeams,
  })
})

const addUserToTeam = async (
    user: User,
    existingTeamNames: string[]
): Promise<AddUserRecord> => {
  if (!existingTeamNames.includes(user.teamName)) {
    return {
      status: 'rejected',
      message: `Team ${user.teamName} does not exist. Please initialize it first.`,
    }
  }

  const teamDoc = firestore().collection('teams').doc(user.teamName)
  const existingMembers: User[] = (await teamDoc.get()).data()?.members

  if (existingMembers === undefined) {
    return {
      status: 'rejected',
      message: `Internal server error: ${user.teamName} member array has an issue`,
    }
  }

  const existingUIDs = existingMembers.map((e) => e.uid)

  if (existingUIDs.includes(user.uid)) {
    return {
      status: 'rejected',
      message: `User ${user.email} is already in team ${user.teamName}.`,
    }
  }

  const writeResult = await teamDoc.set(
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
