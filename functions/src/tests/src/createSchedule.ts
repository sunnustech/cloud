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
}

/* we only support less than these number of matches. */
const maxCapacity: Record<Sport, number> = {
  touchRugby: 20,
  dodgeball: 16,
  frisbee: 24,
  tchoukball: 16,
  volleyball: 16,
  captainsBall: 20,
}

const sportDensity: Record<Sport, number> = {
  touchRugby: 5,
  dodgeball: 4,
  frisbee: 6,
  tchoukball: 4,
  volleyball: 4,
  captainsBall: 5,
}

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

const venues: Record<Sport, string> = {
  touchRugby: 'Football Field',
  dodgeball: 'Multi-Purpose Courts',
  frisbee: 'Science Fields',
  tchoukball: 'Tennis Courts',
  volleyball: 'Volleyball Courts',
  captainsBall: 'Basketball Courts',
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

// generate touchRugby timings first

const schedule: Event[] = []

const sport: Sport = 'touchRugby'

console.log(sport)

// first pair of start and end
const s = new Date(0, 0, 0, 9)
const e = new Date(s)
e.setMinutes(s.getMinutes() + matchLength[sport])

const matches: number[][] = roundRobinFixtures[sportDensity[sport]]

// handle lunch break

// courts.forEach
matches.forEach((match) => {
  schedule.push({
    start: time(s),
    end: time(e),
    venue: venues[sport],
    court: 'Court 1',
    round: 'round_robin',
    sport,
  })

  s.setMinutes(s.getMinutes() + matchInterval[sport])
  e.setMinutes(e.getMinutes() + matchInterval[sport])
  console.log(time(s), time(e))
})

console.log(schedule.map((e) => e.start))
