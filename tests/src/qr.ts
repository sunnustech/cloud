import axios from 'axios'
import { timestamp } from './utils/timestamp'
import { cloud } from './utils/firebase'

const fn = 'development-QRApi'
timestamp(fn)

type Command = 'startTimer' | 'pauseTimer' | 'resumeTimer' | 'stopTimer'

const command: Command = 'startTimer'

const packet = {
  points: 10,
  command,
  station: 'Slide',
  facilitator: 'Khang',
  teamName: 'awakening',
}

axios.post(cloud(fn), packet).then((res) => {
  const data = res.data
  console.debug(data)
})
