import axios from 'axios'
import { timestamp } from './timestamp'
import { cloud } from './firebase'
import { sanitizePhoneNumber } from './utils'
import { InitializeUser } from '../../types/sunnus-init'
import { parse } from 'csv-parse/sync'
import fs from 'fs'

const createUser = (user: InitializeUser): InitializeUser => {
  return {
    email: user.email,
    teamName: user.teamName,
    phoneNumber: sanitizePhoneNumber('65', user.phoneNumber),
  }
}

/* read from the csv file */
const fileData = fs.readFileSync('src/csv/createUsers.csv')
const csv: InitializeUser[] = parse(fileData, {
  delimiter: ',',
  trim: true,
  columns: true,
})

const sanitizedUserList: InitializeUser[] = csv.map((user) => createUser(user))

const fn = 'development-createUsers'
timestamp(fn)

axios.post(cloud(fn), { userList: sanitizedUserList }).then((res) => {
  const data = res.data
  console.log(data)
})
