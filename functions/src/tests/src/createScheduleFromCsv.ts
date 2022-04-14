import { parse } from 'csv-parse/sync'
import fs from 'fs'

const fileData = fs.readFileSync('src/csv/scheduleConfig.csv')

const True: Record<string, boolean> = {
  yes: true,
  true: true,
}

const False: Record<string, boolean> = {
  no: true,
  false: true,
}

type Sport =
  | 'touchRugby'
  | 'dodgeball'
  | 'frisbee'
  | 'tchoukball'
  | 'volleyball'
  | 'captainsBall'

type SportConfig = {
  sport: Sport
  matchLength: number
  matchInterval: number
  matchBreak: number
  venue: string
  court: string[]
  startTime: string
  lunchStart: string
  lunchEnd: string
  alternating: boolean
}

type ScheduleConfig = Record<Sport, SportConfig>

const sc: ScheduleConfig = parse(fileData, {
  delimiter: ',',
  trim: true,
  groupColumnsByName: true,
  objname: 'sport',
  columns: [
    'sport',
    'matchLength',
    'matchBreak',
    'venue',
    'courts',
    'courts',
    'courts',
    'courts',
    'startTime',
    'lunchStart',
    'lunchEnd',
    'alternating',
  ],
  cast: (value) => {
    if (True[value]) {
      return true
    }
    if (False[value]) {
      return false
    }
    if (value.includes(':')) {
      // is a HH:MM string
      return value
    }
    const int = parseInt(value)
    if (!isNaN(int)) {
      return int
    }
    return value
  },
  onRecord: (rec) => {
    const config = rec[1]
    config.matchInterval = config.matchLength + config.matchBreak
    // handle empty courts
    config.courts = config.courts.filter((e: string) => e !== '')
    delete config.matchBreak
    delete config.sport
    return rec
  },
})

console.log(sc)
