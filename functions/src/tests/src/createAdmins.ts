import axios from 'axios'
import { timestamp } from './utils/timestamp'
import { cloud } from './utils/firebase'
import fs from 'fs'

/* read from the csv file */
const fileData = fs.readFileSync('src/csv/createUsers.csv')

const fn = 'development-createUsers'
timestamp(fn)

axios.post(cloud(fn), { userListCsvString: fileData.toString() }).then((res) => {
  const data = res.data
  console.debug(data)
})
