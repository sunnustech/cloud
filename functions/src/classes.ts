import { removeSpaces } from "./utils/string"

interface InitializeUser {
  phoneNumber: string
  email: string
  role: string
  teamName: string
}

function sanitizeCsvUserProps(props: InitializeUser): InitializeUser {
  function sanitizePhoneNumber(prefix: string, phone: string): string {
    const noSpaces = removeSpaces(phone)
    const re = new RegExp(`^\\+${prefix}`)
    return noSpaces.replace(re, '')
  }
  return {
    email: props.email,
    teamName: props.teamName,
    phoneNumber: sanitizePhoneNumber('65', props.phoneNumber),
    role: props.role || 'participant',
  }
}

export namespace Sunnus {
  export class User {
    realEmail: string
    role: string
    phoneNumber: string
    teamName: string
    email: string
    loginIdNumberPart: string
    uid: string
    registeredInFirebase: boolean
    registeredInSunnus: boolean
    // constructor values can be read directly from csv
    constructor(props: InitializeUser) {
      const clean = sanitizeCsvUserProps(props)
      this.phoneNumber = clean.phoneNumber
      this.realEmail = clean.email
      this.role = clean.role
      this.teamName = clean.teamName
      this.email = ''
      this.loginIdNumberPart = ''
      this.uid = ''
      this.registeredInFirebase = false
      this.registeredInSunnus = false
    }
  }
}
