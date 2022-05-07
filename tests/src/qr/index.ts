import axios from 'axios'
import { timestamp } from '../utils/timestamp'
import { cloud } from '../utils/firebase'
import fs from 'fs'

const fn = 'development-QRApi'
timestamp(fn)

export type Command =
  | 'startTimer'
  | 'pauseTimer'
  | 'resumeTimer'
  | 'stopTimer'
  | 'resetTimer'

export async function createOneTeam() {
  const fileData = fs.readFileSync(`src/csv/createOneTeam.csv`)
  const fn = `development-createTeams`
  timestamp(fn)
  axios
    .post(cloud(fn), { teamListCsvString: fileData.toString() })
    .then((res) => {
      const data = res.data
      console.debug(data)
    })
}

export const sendQRRequest = async (command: Command) => {
  const packet = {
    points: 10,
    command,
    station: 'Slide',
    facilitator: 'Khang',
    teamName: 'developer_team',
  }
  const response = await axios.post(cloud(fn), packet)
  const data = response.data
  console.log(data)
  return data.status
}

export const sendFullQRRequest = async (packet: {
  points: number
  command: string
  station: string
  facilitator: string
  teamName: string
}) => {
  const response = await axios.post(cloud(fn), packet)
  const data = response.data
  console.log(data)
}
