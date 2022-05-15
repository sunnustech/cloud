import { Match, Round, Sport } from "./TSS"

export type IncomingHandleMatchRequest = Match & {
  sport: Sport
  matchNumber: number
  round: Round
  facilitatorEmail: string
}

export type ServerMatchRecord = IncomingHandleMatchRequest & {
  timestamp: Date
}
