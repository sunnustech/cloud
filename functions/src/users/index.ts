import { https } from 'firebase-functions'
import { getAuth } from 'firebase-admin/auth'

export const createUsers = https.onRequest(async (req, res) => {
  const createUserResult = await getAuth().createUser({
    email: 'automaticallyCreatedUser@gmail.com',
    emailVerified: false,
    password: 'sunnus',
    disabled: false,
  })
  res.json({ result: createUserResult })
})
