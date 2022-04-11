// server side types

export type RequestUser = {
  email: string
  phoneNumber: string
  teamName: string
}
export type User = RequestUser & {
  uid: string
}
export type FirebaseUserInit = {
  email: string
  emailVerified: false
  password: string
  disabled: false
}
export type Member = {
  email: string
  loginId: string
  phoneNumber: string
  uid: string
}
export type AddUserRecord = {
  message: any
  status: 'fulfilled' | 'rejected'
}
