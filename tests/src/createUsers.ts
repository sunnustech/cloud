import axios from 'axios'
import { timestamp } from './timestamp'
import { cloud } from './firebase'
import { NewUser, User } from './types/users'
import { sanitizePhoneNumber } from './utils'

const createUser = ({ email, phone }: NewUser): User => {
  return {
    email,
    // TODO: handle non-sg phone numbers
    phone: sanitizePhoneNumber('65', phone),
    password: 'sunnus',
    disabled: false,
    emailVerified: false,
  }
}

const csv = [
  { email: '1@gmail.com', phone: '9832 6742' },
  { email: '2@gmail.com', phone: '+65 91212368' },
  { email: '3@gmail.com', phone: '+65 9121 2 368' },
]

const newUserList: User[] = csv.map((user) =>
  createUser({
    email: user.email,
    phone: sanitizePhoneNumber('65', user.phone),
  })
)

const fn = 'createUsers'
timestamp(fn)
axios.post(cloud(fn), { A: newUserList }).then((res) => console.log(res.data))
