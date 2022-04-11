import axios from 'axios'
import { timestamp } from './timestamp'
import { cloud } from './firebase'
import { SunNUSUser, FirebaseUser } from './types/users'

const createUser = (user: SunNUSUser): FirebaseUser => {
  return {
    email: user.email,
  }
}

const csv: SunNUSUser[] = [
  { email: '1@gmail.com', phoneNumber: '9832 6742' },
  { email: '2@gmail.com', phoneNumber: '+65 91212368' },
]

const sanitizedUserList: FirebaseUser[] = csv.map((user) => createUser(user))

const fn = 'createUsers'
timestamp(fn)
axios.post(cloud(fn), { userList: sanitizedUserList }).then((res) => {
  const data = res.data
  console.log(data)
})
