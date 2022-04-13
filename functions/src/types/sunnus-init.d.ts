export type RegisteredEvents = {
  TSS?: {
    volleyball?: boolean
    dodgeball?: boolean
    tchoukball?: boolean
    frisbee?: boolean
  }
  SOAR?: boolean
}

/* InitializeXYZ will contain the minimum
 * props required to initialize XYZ.
 *
 */

export type InitializeTeam = {
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

