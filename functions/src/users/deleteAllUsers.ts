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

  const usersCollection = firestore().collection('users')
  const allUsersData = usersCollection.doc('allUsersData')
  const uidsToRemove: string[] =
    (await allUsersData.get()).data()?.uidList || []

  const loginIdsToRemove: string[] = []
  const usersDataDoc = await usersCollection.get()
  usersDataDoc.forEach(doc => {
    const d = doc.data()
    const n = d.loginIdNumber
    if (typeof n === 'string' && n !== '')
    loginIdsToRemove.push(n)
  })

  /* get list of all uids */
  if (!uidsToRemove || uidsToRemove.length === 0) {
    res.json({
      message:
        'There are no automatically generated users in database to delete.',
    })
    return
  }

  const firebaseRemoveResult = await getAuth()
    .deleteUsers(uidsToRemove)
    .then((deleteUsersResult) => {
      // only reset allIdsDoc if successful
      allUsersData.update({
        uidList: firestore.FieldValue.arrayRemove(...uidsToRemove),
        loginIdList: firestore.FieldValue.arrayRemove(...loginIdsToRemove),
      })
      return deleteUsersResult
    })

  const removeUserQueue: Promise<WriteResult>[] = []
  uidsToRemove.forEach((uid) => {
    const removeDoc = usersCollection.doc(uid)
    removeUserQueue.push(removeDoc.delete())
  })

  const SunNUSRemoveResult = await Promise.allSettled(removeUserQueue)

  res.json({
    message: 'Processed request to delete all users',
    firebaseRemoveResult,
    SunNUSRemoveResult,
  })
})
