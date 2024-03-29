export type Sport =
  | 'dodgeball'
  | 'frisbee'
  | 'volleyball'
  | 'tchoukball'
  | 'touchRugby'
  | 'captainsBall'

export type Winner = 'A' | 'B' | 'U' | 'D'

export type Round = 'round_robin' | 'quarterfinals' | 'semifinals' | 'finals'

export type MatchRequest = {
  sport: Sport
  matchNumber: number
  winner: Winner
  round: Round
}

export type Match = {
  A: string
  B: string
  winner: Winner
  scoreA: number
  scoreB: number
}

type Matches = Record<number, Match>

export type Rounds = Record<Round, Matches> & {
  champions: string
}

type Sports = Record<Sport, Rounds>

type TSSScheduleEvent = {
  id: number
  title: string
  sport: string
  time: string
  venue: string
  teams: Array<string>
}

export type TSSSchedule = Array<TSSScheduleEvent>

/*
 * To be Firestore-friendly, the final form has to be an object,
 * and first-level values cannot be arrays
 */
export type TSSDatabase = Sports & {
  data: {
    schedule: TSSSchedule
  }
}

/*
 * knockout table Front-end
 */

export type CurrentPageState = Record<Round, number>
