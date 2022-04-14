import axios from 'axios'
import { timestamp } from './utils/timestamp'
import { cloud } from './utils/firebase'

const fn = 'development-initializeTeam'
timestamp(fn)
axios.post(cloud(fn)).then((res) => {
  const data = res.data
  console.log(data)
})
