import axios from 'axios'
import { timestamp } from './utils/timestamp'
import { cloud } from './utils/firebase'

const fn = 'development-deleteAllUsers'
timestamp(fn)
axios.post(cloud(fn), { message: 'please' }).then((res) => {
  const data = res.data
  console.log(data)
})
