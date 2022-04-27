import axios from 'axios'
import { timestamp } from './utils/timestamp'
import { cloud } from './utils/firebase'

const fn = 'development-addUserToTeam'
timestamp(fn)
const request = {
  user: {
    uid:' somethinguniqueagain',
    email: 'test@facebook.com',
    phoneNumber: '91230982',
    loginId: 'anything',
  },
  teamName: 'auto_magic',
}
axios.post(cloud(fn), request).then((res) => {
  const data = res.data
  console.log(data)
})
