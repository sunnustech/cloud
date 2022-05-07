import axios from 'axios'
import { timestamp } from './utils/timestamp'
import { cloud } from './utils/firebase'

const fn = 'development-QRApi'
timestamp(fn)

const packet = {
  points: 10,
  command: 'startTimer',
  station: 'Slide',
  facilitator: 'Khang',
  teamName: 'awakening',
}

axios.post(cloud(fn), packet).then((res) => {
  const data = res.data
  console.debug(data)
})
