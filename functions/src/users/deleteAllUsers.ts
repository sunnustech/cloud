import { https } from 'firebase-functions'
import { firestore } from 'firebase-admin'
import { getAuth } from 'firebase-admin/auth'

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

  const docRef = firestore().collection('users').doc('allIds')
  await docRef.get().then((doc) => {
    const data = doc.data()
    const rmList = data?.data
    if (!rmList || rmList.length === 0) {
      res.json({
        message:
          'There are no automatically generated users in database to delete.',
      })
      return
    }
    getAuth()
        .deleteUsers(rmList)
        .then((deleteUsersResult) => {
          docRef.set({ data: [] })
          res.json({
            message: 'Processed request to delete all users',
            success: deleteUsersResult.successCount,
            failures: deleteUsersResult.failureCount,
          })
          return
        })
        .catch((error) => {
          res.json({
            message: 'Error deleting users:',
            error,
          })
          return
        })
  })
})
