import { SOARTeamProps } from './SOAR'
import { Team } from './sunnus-firestore'

export type Member = {
  email: string
  phone: string
  loginId: string
}

export type RegisteredEvents = {
  TSS?: {
    volleyball?: boolean
    dodgeball?: boolean
    tchoukball?: boolean
    frisbee?: boolean
  }
  SOAR?: boolean
}

export type NewTeamProps = {
  teamName: string
  registeredEvents: RegisteredEvents
  direction: 'A' | 'B'
}

export type TeamProps = NewTeamProps & {
  members: Array<Member>
  SOAR: SOARTeamProps
  SOARTimerEvents: Array<number>
  SOARStart: number
  SOARPausedAt: number
  SOARStationsCompleted: Array<string>
  SOARStationsRemaining: Array<string>
}

type LoginIdProps = {
  email: string
  teamName: string
  index: number
}

type EmailProps = {
  loginId: string
  teamName: string
  index: number
}

type TeamsDatabase = Record<string, Team>

/*
 * To be Firestore-friendly, the final form has to be an object,
 * and first-level values cannot be arrays
 */
export type ParticipantsDatabase = TeamsDatabase & {
  allLoginIds: Record<string, LoginIdProps>
  allEmails: Record<string, EmailProps>
}
