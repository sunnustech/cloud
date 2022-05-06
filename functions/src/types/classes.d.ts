import { FirestoreDataConverter, SetOptions, WriteResult } from '@google-cloud/firestore'

// every thing in namespace Init comes from a csv
// so every type in here should be a subset of string.
declare namespace Init {
  export interface User {
    phoneNumber: string
    email: string
    role: string
    teamName: string
  }
  export interface Team {
    teamName: string
    direction: 'A' | 'B'
    captainsBall: string
    dodgeball: string
    frisbee: string
    tchoukball: string
    touchRugby: string
    volleyball: string
  }
}

export class User {
  realEmail: string
  role: string
  phoneNumber: string
  teamName: string
  email: string
  loginIdNumberPart: string
  loginId: string
  uid: string
  static empty(): User
  static converter: FirestoreDataConverter<User>
  static get(uid: string): Promise<User>
  static set(user: User, options: SetOptions): Promise<WriteResult>
  constructor(props: Init.User)
  isEmpty(): boolean
  setUid(value: string): void
  setLoginId(value: string): void
}

export class Team {
  members: string[]
  teamName: string
  constructor(props: Init.Team)
  static converter: FirestoreDataConverter<User>
}
