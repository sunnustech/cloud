/* STORY
 * each pre-elimination fixture has m groups of n teams
 * doing round-robin within those n teams.
 *
 * REQUIREMENTS
 * that each team must play at least 3 matches
 * (that is TSS's promise to the participants)
 *
 * TODO: handle all number of groups from 9 to 24 inclusive
 */

import { stringify } from 'csv-stringify'
import fs from 'fs'
import {
  Sport,
  Event,
  ScheduleConfig,
} from '../../types/delete-me-after-done-with-schedule-thanks'
import { readScheduleConfig } from './createScheduleFromCsv'

/* we only support less than these number of matches. */
// const maxCapacity: Record<Sport, number> = {
//   touchRugby: 20,
//   dodgeball: 16,
//   frisbee: 24,
//   tchoukball: 16,
//   volleyball: 16,
//   captainsBall: 20,
// }

const roundRobinFixtures: Record<number, number[][]> = {
  4: [
    // = 4 * 3 / 2 = 6
    [1, 2],
    [3, 4],
    [1, 3],
    [2, 4],
    [1, 4],
    [2, 3],
  ],
  5: [
    // = 5 * 4 / 2 = 10
    [1, 2],
    [3, 4],
    [1, 5],
    [2, 3],
    [4, 5],
    [1, 3],
    [2, 4],
    [3, 5],
    [1, 4],
    [2, 5],
  ],
  6: [
    // = 6 * 5 / 2 = 15
    [1, 3],
    [4, 5],
    [2, 6],
    [1, 4],
    [3, 6],
    [2, 5],
    [4, 6],
    [2, 3],
    [1, 5],
    [3, 4],
    [1, 2],
    [5, 6],
    [2, 4],
    [1, 6],
    [3, 5],
  ],
}

// const preEliminationFixtures

const sports: Sport[] = [
  'touchRugby',
  'dodgeball',
  'frisbee',
  'tchoukball',
  'volleyball',
  'captainsBall',
]

function dateify(HHMM: string): Date {
  const [h, m] = HHMM.split(':').map((e) => parseInt(e))
  return new Date(0, 0, 0, h, m)
}

// lunch break is 1200 - 1300
function duringLunch(date: Date, start: string, end: string): boolean {
  const [s, e] = [start, end].map((e) => dateify(e).getTime())
  const t = date.getTime()
  return t >= s && t < e
}

function letter(n: number): string {
  if (n < 0 || n > 25) {
    return '_'
  }
  return (n + 10).toString(36).toUpperCase()
}

function time(t: Date): string {
  return t.toLocaleTimeString('en-sg', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

function startEndInit(first: Date, matchLength: number) {
  const s = new Date(first)
  const e = new Date(first)
  e.setMinutes(s.getMinutes() + matchLength)
  return [s, e]
}

// const sport: Sport = 'captainsBall'

function incrementTime(s: Date, e: Date, interval: number): void {
  s.setMinutes(s.getMinutes() + interval)
  e.setMinutes(e.getMinutes() + interval)
}

const schedule: Event[] = []

const scheduleConfigCsv = fs.readFileSync('src/csv/scheduleConfig.csv')
const overallConfig: ScheduleConfig = readScheduleConfig(scheduleConfigCsv)

sports.forEach((sport) => {
  const config = overallConfig[sport]
  const density = config.density
  const matches: number[][] = roundRobinFixtures[density]
  const courts = config.courts
  courts.forEach((court, groupIndex) => {
    // first pair of start and end
    const first = dateify(config.startTime)
    const [s, e] = startEndInit(first, config.matchLength)

    matches.forEach((match) => {
      // timeskip through lunch break
      const pastLunch = () => {
        const lunch = (t: Date) =>
          duringLunch(t, config.lunchStart, config.lunchEnd)
        if (lunch(s) || lunch(e)) {
          const lunchEnd = dateify(config.lunchEnd)
          s.setTime(new Date(lunchEnd).getTime())
          e.setTime(new Date(s).getTime())
          e.setMinutes(s.getMinutes() + config.matchLength)
        }
      }
      const inc = () => incrementTime(s, e, config.matchInterval)
      const add = (inc: number) =>
        schedule.push({
          start: time(s),
          end: time(e),
          venue: config.venue,
          round: 'round_robin',
          court,
          sport,
          A: `${letter(inc)}${match[0]}`,
          B: `${letter(inc)}${match[1]}`,
          winner: 'U',
        })
      if (config.alternating) {
        pastLunch()
        add(2 * groupIndex)
        inc()
        pastLunch()
        add(2 * groupIndex + 1)
        inc()
      } else {
        pastLunch()
        add(groupIndex)
        inc()
      }
    })
  })
})

const _courts: string[] = []
const field: keyof Event = 'start'

schedule.forEach((e) => {
  if (!_courts.includes(e[field])) {
    _courts.push(e[field])
  }
})

// console.log(_courts)

fs.writeFileSync('schedule.json', JSON.stringify(schedule, null, 4))
const logger = fs.createWriteStream('schedule.csv')
stringify(
  schedule,
  {
    header: true,
  },
  (_, records) => {
    logger.write(records)
  }
)

console.log(schedule.length)
