import { https } from 'firebase-functions'
import { WriteResult } from '@google-cloud/firestore'
import { getAuth } from 'firebase-admin/auth'
import { deleteAllUsers as keyCheck } from '../utils/keyChecks'
import { hasMissingKeys } from '../utils/exits'
import { firestore } from 'firebase-admin'
import { resultSummary } from '../utils/response'

/**
 * Returns an array of user ids to be removed
 * 
 * @param {string[]} whitelist list of user ids to preserve 
 * @returns {Promise<string[]>} to be removed, preserving whitelisted ids
 */
async function getUidsToRemove(whitelist: string[]): Promise<string[]> {
  const users = await getAuth().listUsers()
  const filtered = users.users.filter((x) => !whitelist.includes(x.email || ''))
  return filtered.map((x) => x.uid)
}

/**
 * Deletes all users from authentication and firebase unless specified in whitelist
 * Whitelisted users to be specified in request body
 */
export const deleteAllUsers = https.onRequest(async (req, res) => {
  if (hasMissingKeys(keyCheck, req, res)) return

  const whitelist: string[] = req.body.whitelist

  const uidsToRemove: string[] = await getUidsToRemove(whitelist)

  const userResult = await getAuth()
    .deleteUsers(uidsToRemove)
    .then((deleteUsersResult) => {
      return deleteUsersResult
    })

  const removeDocQueue: Promise<WriteResult>[] = []
  const usersCollection = firestore().collection('users')
  const query = usersCollection.where('email', 'not-in', whitelist)
  const snapshot = await query.get()
  snapshot.forEach((doc) => {
    removeDocQueue.push(usersCollection.doc(doc.id).delete())
  })

  const collectionResult = resultSummary(await Promise.allSettled(removeDocQueue))

  res.json({
    message: 'Processed request to delete all users',
    userResult,
    collectionResult,
  })
})
