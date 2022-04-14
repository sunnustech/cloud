import {
  RoundRobinConfig,
  ScheduleConfig,
  Sport,
  Event,
} from '../types/schedule'
import {
  dateify,
  letter,
  time,
  inBetween,
  startEndInit,
  incrementTime,
} from '../utils/schedule'

const sports: Sport[] = [
  'touchRugby',
  'dodgeball',
  'frisbee',
  'tchoukball',
  'volleyball',
  'captainsBall',
]

export const makeSchedule = (
    scheduleConfig: ScheduleConfig,
    rr: RoundRobinConfig
): Event[] => {
  const schedule: Event[] = []

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

  return schedule
}
