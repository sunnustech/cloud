import { https } from 'firebase-functions'
import { firestore } from 'firebase-admin'
import { User } from '../types/sunnus-firestore'
import { WriteResult } from '@google-cloud/firestore'
import { partition } from '../utils'

export const assignUsers = https.onRequest(async (req, res) => {
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

  const userCollection = firestore().collection('users')
  const teamCollection = firestore().collection('teams')

  const users = await userCollection.get()
  const assignQueue: Promise<WriteResult>[] = []

  users.forEach((doc) => {
    const d = doc.data()
    const user: User = {
      email: d.email,
      loginId: d.loginId,
      phoneNumber: d.phoneNumber,
      teamName: d.teamName,
      uid: d.uid,
      loginIdNumber: d.loginIdNumber,
    }
    // skip if no teamName
    if (!user.teamName) {
      return
    }
    const teamDoc = teamCollection.doc(user.teamName)
    assignQueue.push(
        teamDoc.update({
          members: firestore.FieldValue.arrayUnion(user.uid),
        })
    )
  })

  const writeResults = await Promise.allSettled(assignQueue)

  const [fulfilled, rejected] = partition(
      writeResults,
      (result) => result.status === 'fulfilled'
  )

  /* get list of all teams */
  /* get list of team-less users */
  /* return list of users that got added to their team */
  /* return list of users that did not get added to a team */

  /* send back the statuses */
  res.json({ message: '[WIP] assigning users...', fulfilled, rejected })
})
