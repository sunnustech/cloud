import axios from 'axios'
import { timestamp } from './timestamp'
import { cloud } from './firebase'

const fn = 'initializeTeam'
timestamp(fn)
axios.post(cloud(fn)).then((res) => {
  const data = res.data
  console.log(data)
})
