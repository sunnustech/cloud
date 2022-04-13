import { RegisteredEvents } from "./teams"

/* InitializeXYZ will contain the minimum
 * props required to initialize XYZ.
 *
 */

export type InitializeTeam = {
  teamName: string
  registeredEvents: RegisteredEvents
  direction: 'A' | 'B'
}

export type InitializeUser = {
  email: string
  phoneNumber: string
  teamName: string
}

export type InitializeFirebaseUser = {
  email: string
  emailVerified: false
  password: string
  disabled: false
}

