import axios from 'axios'
import { timestamp } from '../utils/timestamp'
import { cloud } from '../utils/firebase'

const fn = 'development-QRApi'
timestamp(fn)

type Command = 'startTimer' | 'pauseTimer' | 'resumeTimer' | 'stopTimer'

export const sendQRRequest = async (command: Command) => {
  const packet = {
    points: 10,
    command,
    station: 'Slide',
    facilitator: 'Khang',
    teamName: 'allegation',
  }
  const response = await axios.post(cloud(fn), packet)
  const data = response.data
  return data.status
}
