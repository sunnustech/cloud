export type Sport =
  | 'touchRugby'
  | 'dodgeball'
  | 'frisbee'
  | 'tchoukball'
  | 'volleyball'
  | 'captainsBall'

export type Round = 'round_robin' | 'quarterfinals' | 'semifinals' | 'finals'

export type Event = {
  start: string
  end: string
  sport: Sport
  venue: string
  court: string
  round: Round
  A: string
  B: string
  idA: string
  idB: string
  completed: boolean
  winner: 'A' | 'B' | 'U'
}

type SportConfig = {
  sport: Sport
  matchLength: number
  matchInterval: number
  venue: string
  courts: string[]
  startTime: string
  lunchStart: string
  lunchEnd: string
  alternating: boolean
  density: number
}

export type ScheduleConfig = Record<Sport, SportConfig>
export type RoundRobinConfig = Record<number, number[][]>
