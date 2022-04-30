import { getAuth } from 'firebase-admin/auth'
import { https } from 'firebase-functions'

export const getUsers = https.onRequest(async (req, res) => {
  const users = await getAuth().listUsers()
  const real = ['k@sunnus.com', 'r@sunnus.com', 'kevin@sunnus.com']
  const filtered = users.users.filter(x => !real.includes(x.email || ''))
  console.log(filtered.map(x => x.uid))

  /* send back the statuses */
  res.json({ message: 'here are the users' })
  return
})
