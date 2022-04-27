import axios from 'axios'
import { timestamp } from './utils/timestamp'
import { cloud } from './utils/firebase'

const fn = 'development-writeSchema'
timestamp(fn)

const request = { message: 'reset, thanks' }

axios.post(cloud(fn), request).then((res) => {
  console.log(res.data)
})
