import axios from 'axios'
import { timestamp } from './timestamp'
import { cloud } from './firebase'

const fn = 'deleteAllUsers'
timestamp(fn)
axios.post(cloud(fn), { message: 'please' }).then((res) => {
  const data = res.data
  console.log(data)
})
