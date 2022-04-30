import { https } from 'firebase-functions'
import { getAuth } from 'firebase-admin/auth'
import { deleteAllUsers as keyCheck } from '../utils/keyChecks'
import { hasMissingKeys } from '../utils/exits'

async function getUidsToRemove(whitelist: string[]): Promise<string[]> {
  const users = await getAuth().listUsers()
  const filtered = users.users.filter(x => !whitelist.includes(x.email || ''))
  return filtered.map(x => x.uid)
}

export const deleteAllUsers = https.onRequest(async (req, res) => {
  if (hasMissingKeys(keyCheck, req, res)) return

  const whitelist: string[] = req.body.whitelist

  const uidsToRemove: string[] = await getUidsToRemove(whitelist)

  const removeResult = await getAuth()
    .deleteUsers(uidsToRemove)
    .then((deleteUsersResult) => {
      return deleteUsersResult
    })

  res.json({
    message: 'Processed request to delete all users',
    removeResult,
  })
})
