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

import fs from 'fs'

type Sport =
  | 'touchRugby'
  | 'dodgeball'
  | 'frisbee'
  | 'tchoukball'
  | 'volleyball'
  | 'captainsBall'

export type Round = 'round_robin' | 'quarterfinals' | 'semifinals' | 'finals'

type Event = {
  start: string
  end: string
  sport: Sport
  venue: string
  court: string
  round: Round
  A: string
  B: string
  winner: 'A' | 'B' | 'U'
}

/* we only support less than these number of matches. */
// const maxCapacity: Record<Sport, number> = {
//   touchRugby: 20,
//   dodgeball: 16,
//   frisbee: 24,
//   tchoukball: 16,
//   volleyball: 16,
//   captainsBall: 20,
// }

// prettier-ignore
const roundRobinFixtures: Record<number, number[][]> = {
  4: [ // = 4 * 3 / 2 = 6
    [1, 2], [3, 4], [1, 3], [2, 4], [1, 4], [2, 3],
  ],
  5: [ // = 5 * 4 / 2 = 10
    [1, 2], [3, 4], [1, 5], [2, 3], [4, 5], [1, 3],
    [2, 4], [3, 5], [1, 4], [2, 5]
  ],
  6: [ // = 6 * 5 / 2 = 15
    [1, 3], [4, 5], [2, 6], [1, 4], [3, 6], [2, 5],
    [4, 6], [2, 3], [1, 5], [3, 4], [1, 2], [5, 6],
    [2, 4], [1, 6], [3, 5],
  ],
}

// const preEliminationFixtures

const matchLength: Record<Sport, number> = {
  touchRugby: 20,
  dodgeball: 15,
  frisbee: 15,
  tchoukball: 15,
  volleyball: 20,
  captainsBall: 15,
}

const lunchBreaks: Record<Sport, string[]> = {
  touchRugby: ['12:00', '13:00'],
  dodgeball: ['12:00', '13:00'],
  frisbee: ['12:00', '13:00'],
  tchoukball: ['13:00', '14:00'],
  volleyball: ['12:40', '14:00'],
  captainsBall: ['13:00', '14:00'],
}

const getLunchEnd = (sport: Sport): Date => {
  const e = lunchBreaks[sport][1]
  const [h, m] = e.split(':').map(e => parseInt(e))
  return new Date(0, 0, 0, h, m)
}

// lunch break is 1200 - 1300
function duringLunch(date: Date, sport: Sport): boolean {
  const [start, end] = lunchBreaks[sport]
  const [sh, sm] = start.split(':').map(e => parseInt(e))
  const [eh, em] = end.split(':').map(e => parseInt(e))
  const sD = new Date(0, 0, 0, sh, sm)
  const eD = new Date(0, 0, 0, eh, em)
  const s = sD.getTime()
  const e = eD.getTime()
  const t = date.getTime()
  const b = t >= s && t < e
  console.log(time(sD), time(date), time(eD), b)
  // naive check suffices and is actually less buggy
  return (t >= s && t < e)
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
const sport: Sport = 'touchRugby'
const schedule: Event[] = []
const density = sportDensity[sport]
const matches: number[][] = roundRobinFixtures[density]

function incrementTime(s: Date, e: Date, interval: number): void {
  s.setMinutes(s.getMinutes() + interval)
  e.setMinutes(e.getMinutes() + interval)
}

courts[sport].forEach((court, groupIndex) => {
  // first pair of start and end
  const first = new Date(0, 0, 0, 9)
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
        A: `${letter(groupIndex + inc)}${match[0]}`,
        B: `${letter(groupIndex + inc)}${match[1]}`,
        winner: 'U',
      })
    pastLunch()
    add(0)
    inc()
    if (sportDensity[sport] === 4) {
      pastLunch()
      add(1)
      inc()
    }
  })
})

const _courts: string[] = []
const field: keyof Event = 'start'

schedule.forEach((e) => {
  if (!_courts.includes(e[field])) {
    _courts.push(e[field])
  }
})

console.log(_courts)
fs.writeFileSync('schedule.json', JSON.stringify(schedule, null, 4))
