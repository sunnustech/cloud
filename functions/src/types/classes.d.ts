import { FirestoreDataConverter } from '@google-cloud/firestore'
import { SetOptions, WriteResult } from '@google-cloud/firestore'
import { RegisteredEvents } from './sunnus-init'

declare namespace Init {
  export interface User {
    phoneNumber: string
    email: string
    role: string
    teamName: string
  }
  export interface Team {
    teamName: string
  }
  export interface SOARTeam extends Team {
    direction: 'A' | 'B'
  }
  export interface TSSTeam extends Team {
    registeredEvents: RegisteredEvents
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
}
