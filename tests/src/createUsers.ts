import axios from 'axios'
import { timestamp } from './timestamp'
import { cloud } from './firebase'
import { User } from './types/users'
import { sanitizePhoneNumber } from './utils'

const createUser = ({ email, phoneNumber }: User): User => {
  return {
    email,
    // TODO: handle non-sg phone numbers
    phoneNumber: sanitizePhoneNumber('65', phoneNumber),
  }
}

const csv: User[] = [
  { email: '1@gmail.com', phoneNumber: '9832 6742' },
  { email: '2@gmail.com', phoneNumber: '+65 91212368' },
  { email: '3@gmail.com', phoneNumber: '+65 9121 2 368' },
]

const sanitizedUserList: User[] = csv.map((user) =>
  createUser({
    email: user.email,
    phoneNumber: sanitizePhoneNumber('65', user.phoneNumber),
  })
)

const fn = 'createUsers'
timestamp(fn)
axios.post(cloud(fn), { userList: sanitizedUserList }).then((res) => console.log(res.data))
