import { sportList } from '../data/constants'
import { Sport } from '../types'
import { RoundRobinConfig, ScheduleConfig, Event } from '../types/schedule'
import {
  dateify,
  letter,
  time,
  inBetween,
  startEndInit,
  incrementTime,
} from '../utils/schedule'

// exclude upper bound
function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max)
}

function get<T>(object: Record<string, T>, key: string, default_value: T): T {
  var result = object[key]
  return typeof result !== 'undefined' ? result : default_value
}

export const makeSchedule = (
  scheduleConfig: ScheduleConfig,
  rr: RoundRobinConfig,
  cache: Record<Sport, Record<string, string>>,
  debugScores: boolean
): Event[] => {
  const schedule: Event[] = []
  sportList.forEach((sport) => {
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
        const add = (groupIndex: number) => {
          const idA = `${letter(groupIndex)}${match[0]}`
          const idB = `${letter(groupIndex)}${match[1]}`
          const teamNameA = get(cache[sport], idA, 'null team')
          const teamNameB = get(cache[sport], idB, 'null team')
          const scoreA = debugScores ? getRandomInt(10) : -1
          const scoreB = debugScores ? getRandomInt(10) : -1
          schedule.push({
            start: time(s),
            end: time(e),
            venue: config.venue,
            round: 'round_robin',
            court,
            sport,
            scoreA,
            scoreB,
            A: teamNameA,
            B: teamNameB,
            idA,
            idB,
            completed: false,
          })
        }
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

  return schedule
}
