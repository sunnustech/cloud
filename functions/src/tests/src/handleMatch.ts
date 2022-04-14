import axios from 'axios'
import { timestamp } from './utils/timestamp'
import { cloud } from './utils/firebase'

const fn = 'development-handleMatch'
timestamp(fn)

const request = { message: 'requester to server, over!' }

axios.post(cloud(fn), request).then((res) => {
  console.log(res.data)
})
