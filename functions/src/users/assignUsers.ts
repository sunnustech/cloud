import { https } from 'firebase-functions'
import { firestore } from 'firebase-admin'
import { WriteResult } from '@google-cloud/firestore'
import { partition } from '../utils/array'

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
    const user = { teamName: d.teamName, uid: d.uid }
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

  /* send back the statuses */
  res.json({ message: '[WIP] assigning users...', fulfilled, rejected })
})
