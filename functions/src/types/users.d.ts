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

export type AddUserRecord = {
  message: any
  status: 'fulfilled' | 'rejected'
}
