import { https } from 'firebase-functions'
import { firestore } from 'firebase-admin'
import { getAuth } from 'firebase-admin/auth'
import { WriteResult } from '@google-cloud/firestore'
import { please as keyCheck } from '../utils/keyChecks'
import { hasMissingKeys } from '../utils/exits'

export const deleteAllUsers = https.onRequest(async (req, res) => {
  if (hasMissingKeys(keyCheck, req, res)) return

  const usersCollection = firestore().collection('users')
  const allUsersData = usersCollection.doc('allUsersData')
  /* get list of all uids to remove */
  const uidsToRemove: string[] =
    (await allUsersData.get()).data()?.uidList || []

  /* from the list of uids, obtain the list of corresponding
   * loginIds and emails to remove
   */
  const loginIdsToRemove: string[] = []
  const emailsToRemove: string[] = []
  const usersDataDoc = await usersCollection.get()
  usersDataDoc.forEach((doc) => {
    const d = doc.data()
    const n = d.loginIdNumber
    const e = d.realEmail
    if (typeof n === 'string' && n !== '') loginIdsToRemove.push(n)
    if (typeof e === 'string' && e !== '') emailsToRemove.push(e)
  })

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
        emailList: firestore.FieldValue.arrayRemove(...emailsToRemove),
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
