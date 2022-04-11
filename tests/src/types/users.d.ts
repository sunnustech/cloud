export type NewUser = {
  email: string
  phone: string
}

export type User = NewUser & {
  emailVerified: false
  password: 'sunnus'
  disabled: false
}
