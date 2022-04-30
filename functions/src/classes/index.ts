import { removeSpaces } from '../utils/string'

// reference:
// https://firebase.google.com/docs/firestore/manage-data/add-data

function sanitizeCsvUser(props: Csv.User): Csv.User {
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

export namespace Csv {
  export interface User {
    phoneNumber: string
    email: string
    role: string
    teamName: string
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
    loginId: string
    uid: string
    registeredInFirebase: boolean
    registeredInSunnus: boolean
    // constructor values can be read directly from csv
    constructor(props: Csv.User) {
      const clean = sanitizeCsvUser(props)
      this.phoneNumber = clean.phoneNumber
      this.realEmail = clean.email
      this.role = clean.role
      this.teamName = clean.teamName
      this.email = ''
      this.loginId = ''
      this.loginIdNumberPart = ''
      this.uid = ''
      this.registeredInFirebase = false
      this.registeredInSunnus = false
    }
    setUid(value: string) {
      this.uid = value
    }
    setLoginId(value: string) {
      this.loginIdNumberPart = value
      this.loginId = `${this.teamName}${value}`
      this.email = `${this.loginId}@sunnus.com`
    }
  }
}

export class UniquenessChecker<T extends string | number | symbol> {
  database: Partial<Record<T, boolean>>
  constructor() {
    this.database = {}
  }
  get(key: T, defaultValue: T) {
    return key in this.database ? this.database[key] : defaultValue
  }
  exists(key: T): boolean {
    return key in this.database
  }
  push(key: T): boolean {
    if (!(key in this.database)) {
      this.database[key] = true
      return true
    }
    return false
  }
}
