import { https } from 'firebase-functions'
import { firestore } from 'firebase-admin'
import { getAuth } from 'firebase-admin/auth'
import { WriteResult } from '@google-cloud/firestore'

export const deleteAllUsers = https.onRequest(async (req, res) => {
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
  const allIdsDoc = userCollection.doc('allIds')

  /* get list of all uids */
  const data = await allIdsDoc.get()
  const rmList: string[] = data.data()?.data || []
  if (!rmList || rmList.length === 0) {
    res.json({
      message:
        'There are no automatically generated users in database to delete.',
    })
    return
  }

  const firebaseRemoveResult = await getAuth()
    .deleteUsers(rmList)
    .then((deleteUsersResult) => {
      // only reset allIdsDoc if successful
      allIdsDoc.set({ data: [] })
      return deleteUsersResult
    })

  const removeUserQueue: Promise<WriteResult>[] = []
  rmList.forEach((uid) => {
    const removeDoc = userCollection.doc(uid)
    removeUserQueue.push(removeDoc.delete())
  })

  const SunNUSRemoveResult = await Promise.allSettled(removeUserQueue)

  res.json({
    message: 'Processed request to delete all users',
    firebaseRemoveResult,
    SunNUSRemoveResult,
  })
})
