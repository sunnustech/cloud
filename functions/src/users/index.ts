import { https } from 'firebase-functions'
import { User } from '../types/users'
// import { firestore } from 'firebase-admin'
import { getAuth, UserRecord } from 'firebase-admin/auth'

export const createUsers = https.onRequest(async (req, res) => {
  const requestKeys = Object.keys(req.body)

  /* check to see if userList is a property of the request body */
  if (!requestKeys.includes('userList')) {
    res.json({
      keys: requestKeys,
      message: 'please supply a list of users in the property "userList"',
      data: req.body,
    })
    return
  }

  const userList: User[] = req.body.userList
  const awaitStack: Promise<UserRecord>[] = []

  userList.forEach((user) => {
    awaitStack.push(getAuth().createUser({
      email: user.email,
      emailVerified: false,
      password: 'sunnus',
      disabled: false,
      phoneNumber: user.phoneNumber
    }))
  })
  // const collectionRef = firestore().collection('users')
  // TODO: if user exists, send back in response and skip execution
  console.log('request:', req.body)
  res.json({ mirror: req.body })
})
