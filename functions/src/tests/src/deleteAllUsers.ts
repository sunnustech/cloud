import axios from 'axios'
import { timestamp } from './utils/timestamp'
import { cloud } from './utils/firebase'

const fn = 'development-deleteAllUsers'
timestamp(fn)

const whitelist = ['k@sunnus.com', 'r@sunnus.com', 'kevin@sunnus.com']

axios.post(cloud(fn), { whitelist }).then((res) => {
  const data = res.data
  console.debug(data)
})
