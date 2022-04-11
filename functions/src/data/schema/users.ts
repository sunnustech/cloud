import { firestore } from 'firebase-admin'
import { Member } from '../../types/users'
import { WriteResult } from '@google-cloud/firestore'

const userList: Member[] = [
  {
    teamName: "auto_magic",
    email: 'one@gmail.com',
    loginId: 'automagic123456',
    phoneNumber: '91239845',
    uid: 'from_writeSchema___asdfghjklsemicolon',
  },
  {
    teamName: "auto_matic",
    email: 'two@gmail.com',
    loginId: 'automatic987654',
    phoneNumber: '90912365',
    uid: 'from_writeSchema___qwertyyoueyeohp',
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
