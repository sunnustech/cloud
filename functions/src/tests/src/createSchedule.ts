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
import { Sport, Event, ScheduleConfig } from '../../types/delete-me-after-done-with-schedule-thanks'
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

const matchLength: Record<Sport, number> = {
  touchRugby: 20,
  dodgeball: 15,
  frisbee: 15,
  tchoukball: 15,
  volleyball: 20,
  captainsBall: 15,
}

const getLunchEnd = (sport: Sport): Date => {
  return dateify(lunchBreaks[sport][1])
}

function dateify(HHMM: string): Date {
  const [h, m] = HHMM.split(':').map((e) => parseInt(e))
  return new Date(0, 0, 0, h, m)
}

// lunch break is 1200 - 1300
function duringLunch(date: Date, sport: Sport): boolean {
  const [start, end] = lunchBreaks[sport].map((e) => dateify(e))
  const s = start.getTime()
  const e = end.getTime()
  const t = date.getTime()
  return t >= s && t < e
}

const matchInterval: Record<Sport, number> = {
  touchRugby: 25,
  dodgeball: 20,
  frisbee: 20,
  tchoukball: 20,
  volleyball: 20,
  captainsBall: 20,
}

const courts: Record<Sport, string[]> = {
  touchRugby: ['Court 1', 'Court 2', 'Court 3', 'Court 4'],
  dodgeball: ['Court 1', 'Court 3'],
  frisbee: ['Field A', 'Field B', 'Field C', 'Field D'],
  tchoukball: ['Court 1', 'Court 2'],
  volleyball: ['Court 1', 'Court 2'],
  captainsBall: ['Court 1', 'Court 2'],
}

const sportDensity: Record<Sport, number> = {
  touchRugby: 5,
  dodgeball: 4,
  frisbee: 6,
  tchoukball: 4,
  volleyball: 4,
  captainsBall: 5,
}

const venues: Record<Sport, string> = {
  touchRugby: 'Football Field',
  dodgeball: 'SRC Multi-Purpose Courts',
  frisbee: 'Science Fields',
  tchoukball: 'SRC Handball Courts',
  volleyball: 'SRC Volleyball Courts',
  captainsBall: 'SRC Basketball Courts',
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

// variable initializations
const lunchBreaks: Record<Sport, string[]> = {
  touchRugby: ['12:00', '13:00'],
  dodgeball: ['12:00', '13:00'],
  frisbee: ['12:00', '13:00'],
  tchoukball: ['13:00', '14:00'],
  volleyball: ['13:00', '14:00'],
  captainsBall: ['13:00', '14:00'],
}

// const sport: Sport = 'captainsBall'

const startTimes: Record<Sport, string> = {
  touchRugby: '9:00',
  dodgeball: '9:00',
  frisbee: '9:00',
  tchoukball: '9:00',
  volleyball: '8:40',
  captainsBall: '9:00',
}

const alternatingMatches: Record<Sport, boolean> = {
  touchRugby: false,
  dodgeball: true,
  frisbee: false,
  tchoukball: true,
  volleyball: true,
  captainsBall: true,
}

function incrementTime(s: Date, e: Date, interval: number): void {
  s.setMinutes(s.getMinutes() + interval)
  e.setMinutes(e.getMinutes() + interval)
}

const schedule: Event[] = []

const scheduleConfigCsv = fs.readFileSync('src/csv/scheduleConfig.csv')
const config: ScheduleConfig = readScheduleConfig(scheduleConfigCsv)

sports.forEach((sport) => {
  const density = sportDensity[sport]
  const matches: number[][] = roundRobinFixtures[density]
  courts[sport].forEach((court, groupIndex) => {
    // first pair of start and end
    const first = dateify(startTimes[sport])
    const [s, e] = startEndInit(first, matchLength[sport])

    matches.forEach((match) => {
      // timeskip through lunch break
      const pastLunch = () => {
        if (duringLunch(s, sport) || duringLunch(e, sport)) {
          const lunchEnd = getLunchEnd(sport)
          s.setTime(new Date(lunchEnd).getTime())
          e.setTime(new Date(s).getTime())
          e.setMinutes(s.getMinutes() + matchLength[sport])
        }
      }
      const inc = () => incrementTime(s, e, matchInterval[sport])
      const add = (inc: number) =>
        schedule.push({
          start: time(s),
          end: time(e),
          venue: venues[sport],
          round: 'round_robin',
          court,
          sport,
          A: `${letter(inc)}${match[0]}`,
          B: `${letter(inc)}${match[1]}`,
          winner: 'U',
        })
      if (alternatingMatches[sport]) {
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
