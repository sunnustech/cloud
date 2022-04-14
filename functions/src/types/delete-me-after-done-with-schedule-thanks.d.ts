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
  winner: 'A' | 'B' | 'U'
}
