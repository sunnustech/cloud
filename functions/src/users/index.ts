import { https } from 'firebase-functions'
import { User } from '../types/users'
// import { firestore } from 'firebase-admin'
// import { getAuth } from 'firebase-admin/auth'

export const createUsers = https.onRequest(async (req, res) => {
  const requestKeys = Object.keys(req)

  /* check to see if newUserList is a property of the request body */
  if (!requestKeys.includes('newUserList')) {
    res.json({
      message: 'please supply a list of users in the property "newUserList"',
    })
    return
  }

  const newUserList: User[] = req.body.newUserList
  // const collectionRef = firestore().collection('users')
  // const createUserResult = await getAuth().createUser({
  //   email: 'automaticallyCreatedUser@gmail.com',
  //   emailVerified: false,
  //   password: 'sunnus',
  //   disabled: false,
  // })
  // TODO: if user exists, send back in response and skip execution
  console.log('request:', req.body)
  res.json({ mirror: req.body })
})
