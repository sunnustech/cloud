import { SOARTeamProps } from './SOAR'

/* a fully-fledged SunNUS team Member */
export type User = {
  email: string
  loginId: string
  phoneNumber: string
  teamName: string
  uid: string
}

/* a SunNUS team */
export type Team = {
  teamName: string
  registeredEvents: {
    TSS?: {
      volleyball?: boolean
      dodgeball?: boolean
      tchoukball?: boolean
      frisbee?: boolean
    }
    SOAR?: boolean
  }
  direction: 'A' | 'B'
  members: string[] // array of members' uids
  SOAR: SOARTeamProps
  SOARTimerEvents: number[]
  SOARStart: number
  SOARPausedAt: number
  SOARStationsCompleted: string[]
  SOARStationsRemaining: string[]
}

/* unused in actual code,
 * this serves as a visual map of what firestore looks like.
 * keys are collection names
 * values are the list of documents
 * generics of the values are the content of each document
 */
export type Firebase = {
  teams: Team[]
  users: User[]
}
