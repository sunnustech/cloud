import { SOARTeamProps } from './SOAR'
import { InitializeTeam, InitializeUser } from './sunnus-init'

/* a fully-fledged SunNUS team Member */
export type User = InitializeUser & {
  loginId: string // TODO: figure out how to assign four unique loginIds
  uid: string // automatically assigned by firebase upon account creation
}

/* a SunNUS team */
export type Team = InitializeTeam & {
  members: string[] // array of members' uids
  SOAR: SOARTeamProps
  SOARTimerEvents: number[]
  SOARStart: number
  SOARPausedAt: number
  SOARStationsCompleted: string[]
  SOARStationsRemaining: string[]
}

/* this serves as a visual map of what firestore looks like.
 * keys are collection names.
 */
export type Firestore = {
  teams: Record<string, Team>
  users: Record<string, User>
}
