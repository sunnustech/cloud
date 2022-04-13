import axios from 'axios'
import { timestamp } from './timestamp'
import { cloud } from './firebase'

const fn = 'development-writeSchema'
timestamp(fn)

const request = { message: 'reset, thanks' }

axios.post(cloud(fn), request).then((res) => {
  console.log(res.data)
})
