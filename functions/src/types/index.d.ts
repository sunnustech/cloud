export type Series = 'TSS' | 'WSS'

export type IncomingHandleMatchRequest = Match & {
  series: Series
  sport: Sport
  matchNumber: number
  round: Round
  facilitatorEmail: string
}

export type ServerMatchRecord = IncomingHandleMatchRequest & {
  timestamp: Date
}
