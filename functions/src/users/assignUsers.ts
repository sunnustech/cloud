import { https } from 'firebase-functions'
// import { firestore } from 'firebase-admin'
// import { getAuth, UserRecord } from 'firebase-admin/auth'
// import { WriteResult } from '@google-cloud/firestore'
// import { initializeTeam } from './initializeTeam'
// import { InitializeUser, InitializeFirebaseUser } from '../types/sunnus-init'
// import { User } from '../types/sunnus-firestore'

// type AddUserRecord = {
//   message: any
//   status: 'fulfilled' | 'rejected'
// }

export const createUsersAndAddToTeams = https.onRequest(async (req, res) => {
    const requestKeys = Object.keys(req.body)
  /* check to see if message is a property of the request body */
  if (!requestKeys.includes('message')) {
    res.json({
      keys: requestKeys,
      message: 'please supply a list of users in the property "userList"',
      data: req.body,
    })
    return
  }

  /* yes. high level security right here */
  if (req.body.message !== 'please') {
    res.json({
      keys: requestKeys,
      message: 'use the magic word please',
      data: req.body,
    })
    return
  }

  /* send back the statuses */
  res.json({message: '[WIP] assigning users...'})
})
