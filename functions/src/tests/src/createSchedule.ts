/* STORY
 * each pre-elimination fixture has m groups of n teams
 * doing round-robin within those n teams.
 *
 * REQUIREMENTS
 * that each team must play at least 3 matches
 * (that is TSS's promise to the participants)
 */

import { stringify } from 'csv-stringify'
import fs from 'fs'
import { Sport, Event, ScheduleConfig } from '../../types/schedule'
import { readRoundRobinConfig } from './parsers/roundRobinConfig'
import { readScheduleConfig } from './parsers/scheduleConfig'

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

function inBetween(c: Date, a: Date, b: Date): boolean {
  const [C, A, B] = [c, a, b].map((e: Date) => e.getTime())
  return A <= C && C < B
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

function incrementTime(s: Date, e: Date, interval: number): void {
  s.setMinutes(s.getMinutes() + interval)
  e.setMinutes(e.getMinutes() + interval)
}

const schedule: Event[] = []

const filenames = ['src/csv/scheduleConfig.csv', 'src/csv/roundRobinConfig.csv']
const buffers = filenames.map((f) => fs.readFileSync(f))
const scheduleConfig: ScheduleConfig = readScheduleConfig(buffers[0])
const rr = readRoundRobinConfig(buffers[1])

sports.forEach((sport) => {
  const config = scheduleConfig[sport]
  const matches: number[][] = rr[config.density]
  const ls = dateify(config.lunchStart)
  const le = dateify(config.lunchEnd)
  const courts = config.courts
  courts.forEach((court, groupIndex) => {
    // first pair of start and end
    const first = dateify(config.startTime)
    const [s, e] = startEndInit(first, config.matchLength)

    matches.forEach((match) => {
      // timeskip through lunch break
      const skipToAfterLunch = () => {
        const duringLunch = (t: Date) => inBetween(t, ls, le)
        if (duringLunch(s) || duringLunch(e)) {
          s.setTime(new Date(le).getTime())
          e.setTime(new Date(le).getTime())
          e.setMinutes(le.getMinutes() + config.matchLength)
        }
      }
      const inc = () => incrementTime(s, e, config.matchInterval)
      const add = (groupIndex: number) =>
        schedule.push({
          start: time(s),
          end: time(e),
          venue: config.venue,
          round: 'round_robin',
          court,
          sport,
          A: `${letter(groupIndex)}${match[0]}`,
          B: `${letter(groupIndex)}${match[1]}`,
          winner: 'U',
        })
      if (config.alternating) {
        skipToAfterLunch()
        add(2 * groupIndex)
        inc()
        skipToAfterLunch()
        add(2 * groupIndex + 1)
        inc()
      } else {
        skipToAfterLunch()
        add(groupIndex)
        inc()
      }
    })
  })
})

const writer = fs.createWriteStream('schedule.csv')
stringify(schedule, { header: true }, (_, records) => {
  writer.write(records)
})

console.log(schedule.length)
