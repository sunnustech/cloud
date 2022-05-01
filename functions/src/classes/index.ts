import { firestore } from 'firebase-admin'
import { sanitizePhoneNumber } from '../utils/string'
import { FirestoreDataConverter } from '@google-cloud/firestore'
import { SetOptions, WriteResult } from '@google-cloud/firestore'
import * as sunnus from '../types/classes'

// reference:
// https://firebase.google.com/docs/firestore/manage-data/add-data

namespace Init {
  export interface User {
    phoneNumber: string
    email: string
    role: string
    teamName: string
  }
}

export class User implements sunnus.User {
  realEmail: string
  role: string
  phoneNumber: string
  teamName: string
  email: string
  loginIdNumberPart: string
  loginId: string
  uid: string
  static empty = new User({
    phoneNumber: '',
    role: '',
    email: '',
    teamName: '',
  })
  static converter: FirestoreDataConverter<User> = {
    toFirestore: (user: User) => {
      return {
        email: user.email,
        phoneNumber: user.phoneNumber,
        realEmail: user.email,
        role: user.role,
        teamName: user.teamName,
        loginId: user.loginId,
        uid: user.uid,
      }
    },
    fromFirestore: (snapshot) => {
      const data = snapshot.data()
      const user = new User({
        phoneNumber: data.phoneNumber,
        role: data.role,
        email: data.email,
        teamName: data.teamName,
      })
      user.setUid(data.uid)
      user.setLoginId(data.loginId)
      return user
    },
  }
  static async get(uid: string): Promise<User> {
    const ref = firestore()
      .collection('users')
      .doc(uid)
      .withConverter(this.converter)
    const docSnap = await ref.get()
    const data = docSnap.data()
    if (data !== undefined) {
      return data
    }
    return this.empty
  }
  static async set(user: User, options: SetOptions): Promise<WriteResult> {
    const ref = firestore()
      .collection('users')
      .doc(user.uid)
      .withConverter(this.converter)
    const result = await ref.set(user, options)
    return result
  }
  // constructor values can be read directly from csv
  public constructor(props: Init.User) {
    this.phoneNumber = sanitizePhoneNumber(props.phoneNumber)
    this.realEmail = props.email
    this.role = props.role || ''
    this.teamName = props.teamName
    this.email = ''
    this.loginId = ''
    this.loginIdNumberPart = ''
    this.uid = ''
  }
  isEmpty(): boolean {
    const values = Object.values(this)
    return values.every((v) => v === '')
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
