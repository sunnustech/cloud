import axios from 'axios'
import { timestamp } from './timestamp'
import { cloud } from './firebase'
import { NewTeamProps } from '../../types/participants'
import { parse } from 'csv-parse/sync'
import fs from 'fs'

type CsvTeamProps = {
  teamName: string
  volleyball: string
  dodgeball: string
  frisbee: string
  tchoukball: string
  SOAR: string
  direction: 'A' | 'B'
}

const fn = 'createTeams'
timestamp(fn)

const request = { message: 'requester to server, over!' }

/* read from the csv file */
const fileData = fs.readFileSync('src/csv/createTeams.csv')
const csv: CsvTeamProps[] = parse(fileData, {
  delimiter: ',',
  trim: true,
  columns: true,
})

const teamList: NewTeamProps[] = csv.map((csvTeam) => ({
  teamName: csvTeam.teamName,
  direction: csvTeam.direction,
  registeredEvents: {
    TSS: {
      volleyball: csvTeam.volleyball !== '',
      tchoukball: csvTeam.tchoukball !== '',
      frisbee: csvTeam.frisbee !== '',
      dodgeball: csvTeam.dodgeball !== '',
    },
    SOAR: csvTeam.SOAR !== '',
  },
}))

axios.post(cloud(fn), { teamList }).then((res) => {
  const data = res.data
  console.log(data)
})
