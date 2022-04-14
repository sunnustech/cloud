import axios from 'axios'
import { timestamp } from './utils/timestamp'
import { cloud } from './utils/firebase'

const fn = 'development-getSchedule'
timestamp(fn)
axios.post(cloud(fn), { filter: ['sport', 'captainsBall'] }).then((res) => {
  const data = res.data
  console.log(data)
})
