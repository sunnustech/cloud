import { firestore } from 'firebase-admin'
import { WriteResult } from '@google-cloud/firestore'
import { User } from '../../types/sunnus-firestore'

const userList: User[] = [
  {
    teamName: 'developer_team',
    email: 'k@sunnus.com',
    realEmail: 'actual-khang@gmail.com',
    loginId: 'supposed to be long',
    phoneNumber: '91239845',
    uid: 'VMXuhnIg2jcKGGt9y6D1GDV9gBR2', // this is legit
    loginIdNumber: 'supposed to be a number',
    role: 'admin',
  },
  {
    teamName: 'developer_team',
    email: 'r@sunnus.com',
    realEmail: 'actual-ryan@gmail.com',
    loginId: 'supposed to be long',
    phoneNumber: '90912365',
    uid: 'xo05ywdQhsSLYvXe0CIozFXYnB32', // this is legit
    loginIdNumber: 'supposed to be a number',
    role: 'admin',
  },
  {
    teamName: 'developer_team',
    email: 'kevin@sunnus.com',
    realEmail: 'actual-kevin@gmail.com',
    loginId: 'supposed to be long',
    phoneNumber: '91230412',
    uid: 'joDEJYPYvfQDS8ukW7bG6MEQUY53', // this is legit
    loginIdNumber: 'supposed to be a number',
    role: 'tester',
  },
]

const writeUserList = async () => {
  const userCollection = firestore().collection('users')
  const setUserQueue: Promise<WriteResult>[] = []

  userList.forEach((user) => {
    const uid = user.uid
    const userDocument = userCollection.doc(uid)
    setUserQueue.push(userDocument.set(user))
  })

  const writeResult = await Promise.allSettled(setUserQueue)
  return writeResult
}

export default writeUserList
