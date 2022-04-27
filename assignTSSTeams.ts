import { https } from 'firebase-functions'
import { InitializeTeam } from '../types/sunnus-init'
import { Team } from '../types/sunnus-firestore'
import { firestore } from 'firebase-admin'
import { WriteResult } from '@google-cloud/firestore'
// import { assignTSSTeams as keyCheck } from './utils/keyChecks'

export const createTeams = https.onRequest(async (req, res) => {
  const requestKeys = Object.keys(req.body)

  /* check to see if userList is a property of the request body */
  if (!requestKeys.includes('teamList')) {
    res.json({
      keys: requestKeys,
      message: 'please supply a list of users in the property "userList"',
      data: req.body,
    })
    return
  }

  res.json({
    result: 'Round robin handler at your service!',
    writeResult,
  })
})
