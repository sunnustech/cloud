import { FirestoreDataConverter } from '@google-cloud/firestore'
import { SetOptions, WriteResult } from '@google-cloud/firestore'

declare namespace Csv {
  export interface User {
    phoneNumber: string
    email: string
    role: string
    teamName: string
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
  constructor(props: Csv.User)
  isEmpty(): boolean
  setUid(value: string): void
  setLoginId(value: string): void
}
