import { sportList } from '../data/constants'
import { Sport } from '../types/TSS'
import { RoundRobinConfig, ScheduleConfig, Event } from '../types/schedule'
import {
  dateify,
  letter,
  time,
  inBetween,
  startEndInit,
  incrementTime,
} from '../utils/schedule'

/**
 * Returns a random number, just a helper function for debugging
 *
 * @param {number} max upper bound
 * @return {number} random number generated
 */
function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max)
}

/**
 * Acts as a normal get function as per a hashmap, but returns a default value if we get undefined
 *
 * @param {Record<string, T>} object hashmap of kvps
 * @param {string} key find value in hashmap based on this filter
 * @param {T} defaultValue initialize the value to be this if undefined
 * @return {T} value from hashmap or default value if undefined
 */
function get<T>(object: Record<string, T>, key: string, defaultValue: T): T {
  const result = object[key]
  return typeof result !== 'undefined' ? result : defaultValue
}

/**
 * @param {ScheduleConfig} scheduleConfig
 * @param {RoundRobinConfig} rr
 * @param {Record<Sport, Record<string, string>>} cache
 * @param {boolean} debugScores
 * @returns
 */
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
            group: letter(groupIndex),
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
            completed: debugScores,
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
