import axios from 'axios'
import { notEmpty } from './utils/index'
import { timestamp } from './utils/timestamp'
import { cloud } from './utils/firebase'
import { InitializeTeam } from '../../types/sunnus-init'
import { parse } from 'csv-parse/sync'
import fs from 'fs'

type CsvTeamProps = {
  teamName: string
  volleyball: string
  dodgeball: string
  frisbee: string
  tchoukball: string
  touchRugby: string
  captainsBall: string
  SOAR: string
  direction: 'A' | 'B'
}

const fn = 'development-assignTSSTeams'
timestamp(fn)

/* read from the csv file */
const fileData = fs.readFileSync('src/csv/createTeams.csv')
const csv: CsvTeamProps[] = parse(fileData, {
  delimiter: ',',
  trim: true,
  columns: true,
})

const teamList: InitializeTeam[] = csv.map((csvTeam) => ({
  teamName: csvTeam.teamName,
  direction: csvTeam.direction,
  registeredEvents: {
    TSS: {
      touchRugby: notEmpty(csvTeam.touchRugby),
      captainsBall: notEmpty(csvTeam.captainsBall),
      volleyball: notEmpty(csvTeam.volleyball),
      tchoukball: notEmpty(csvTeam.tchoukball),
      frisbee: notEmpty(csvTeam.frisbee),
      dodgeball: notEmpty(csvTeam.dodgeball),
    },
    SOAR: csvTeam.SOAR !== '',
  },
}))

axios.post(cloud(fn), { teamList, please: "Yes" }).then((res) => {
  const data = res.data
  console.debug(data)
})
