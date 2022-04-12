import axios from 'axios'
import { timestamp } from './timestamp'
import { cloud } from './firebase'

const fn = 'createTeams'
timestamp(fn)

const request = { message: 'requester to server, over!' }

axios.post(cloud(fn), request).then((res) => {
  console.log(res.data)
})
