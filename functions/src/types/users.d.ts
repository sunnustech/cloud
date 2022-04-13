// server side types

/* the data packet of a user when receiving a request to create users */
export type RequestUser = {
  email: string
  phoneNumber: string
  teamName: string
}

/* minimum data required to initialize a firebase user */
export type FirebaseUserInit = {
  email: string
  emailVerified: false
  password: string
  disabled: false
}

/* a fully-fledged SunNUS team Member */
export type Member = {
  teamName: string
  email: string
  loginId: string
  phoneNumber: string
  uid: string
}

export type AddUserRecord = {
  message: any
  status: 'fulfilled' | 'rejected'
}
