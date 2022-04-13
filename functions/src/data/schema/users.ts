import { firestore } from 'firebase-admin'
import { WriteResult } from '@google-cloud/firestore'
import { User } from '../../types/sunnus-firestore'

const userList: User[] = [
  {
    teamName: 'auto_magic',
    email: 'automagic123456@sunnus',
    realEmail: 'one@gmail.com',
    loginId: 'automagic123456',
    phoneNumber: '91239845',
    uid: 'from_writeSchema___asdfghjklsemicolon',
    loginIdNumber: '123456',
  },
  {
    teamName: 'auto_matic',
    email: 'automatic987654@sunnus',
    realEmail: 'two@gmail.com',
    loginId: 'automatic987654',
    phoneNumber: '90912365',
    uid: 'from_writeSchema___qwertyyoueyeohp',
    loginIdNumber: '987654',
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
