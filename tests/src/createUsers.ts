import axios from 'axios'
import { timestamp } from './timestamp'
import { cloud } from './firebase'
import { sanitizePhoneNumber } from './utils'

// import { User } from './types/users'
type User = {
  email: string
  phoneNumber: string
  teamName: string
}

const createUser = (user: User): User => {
  return {
    email: user.email,
    teamName: user.teamName,
    phoneNumber: sanitizePhoneNumber('65', user.phoneNumber),
  }
}

const csv: User[] = [
  { email: '1@gmail.com', phoneNumber: '9832 6742', teamName: 'teamA' },
  { email: '2@gmail.com', phoneNumber: '+65 91212368', teamName: 'teamB' },
]

const sanitizedUserList: User[] = csv.map((user) => createUser(user))

const fn = 'createUsers'
timestamp(fn)
axios.post(cloud(fn), { userList: sanitizedUserList }).then((res) => {
  const data = res.data
  console.log(data)
})
