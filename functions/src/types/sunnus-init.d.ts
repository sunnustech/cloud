/* some shared types for easier future changes */

export type RegisteredEvents = {
  TSS: {
    captainsBall: boolean
    dodgeball: boolean
    frisbee: boolean
    tchoukball: boolean
    touchRugby: boolean
    volleyball: boolean
  }
  SOAR: boolean
}

/* InitializeXYZ will contain the minimum
 * props required to initialize XYZ.
 */

/* some intermediate types that are only used in helper functions */

export type InitializeFirebaseUser = {
  email: string
  emailVerified: false
  password: string
  disabled: false
}

/* the core types that will be extended in sunnus-firestore */

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
