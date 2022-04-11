import { SOARTeamProps } from './SOAR'

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

export type newTeamProps = {
  teamName: string
  members: Array<Member>
  registeredEvents: RegisteredEvents
  direction: 'A' | 'B'
}

export type TeamProps = newTeamProps & {
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

type TeamsDatabase = Record<string, TeamProps>

/*
 * To be Firestore-friendly, the final form has to be an object,
 * and first-level values cannot be arrays
 */
export type ParticipantsDatabase = TeamsDatabase & {
  allLoginIds: Record<string, LoginIdProps>
  allEmails: Record<string, EmailProps>
}