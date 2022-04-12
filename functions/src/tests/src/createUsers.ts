import axios from 'axios'
import { timestamp } from './timestamp'
import { cloud } from './firebase'
import { sanitizePhoneNumber } from './utils'
import { RequestUser } from '../../types/users'
import { parse } from 'csv-parse/sync'
import fs from 'fs'

const createUser = (user: RequestUser): RequestUser => {
  return {
    email: user.email,
    teamName: user.teamName,
    phoneNumber: sanitizePhoneNumber('65', user.phoneNumber),
  }
}

const csv: RequestUser[] = [
  { email: '1@gmail.com', phoneNumber: '9832 6742', teamName: 'auto_matic' },
  { email: '2@gmail.com', phoneNumber: '+65 91212368', teamName: 'auto_magic' },
]

/* read from the csv file */
const fileData = fs.readFileSync('src/csv/users.csv')
const data: string[][] = parse(fileData, {
  delimiter: ',',
  trim: true,
  columns: true,
})

console.log('data:', data)

const sanitizedUserList: RequestUser[] = csv.map((user) => createUser(user))

const fn = 'createUsers'
timestamp(fn)

// axios.post(cloud(fn), { userList: sanitizedUserList }).then((res) => {
//   const data = res.data
//   console.log(data)
// })
