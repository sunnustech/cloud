import { firestore } from 'firebase-admin'
import { removeSpaces } from '../utils/string'
import { FirestoreDataConverter, } from '@google-cloud/firestore'
import { SetOptions, WriteResult } from '@google-cloud/firestore'
// import { app } from '../firebase'
// import { CollectionReference, DocumentData } from '@google-cloud/firestore'

// reference:
// https://firebase.google.com/docs/firestore/manage-data/add-data

function sanitizeCsvUser(props: Csv.User): Csv.User {
  function sanitizePhoneNumber(prefix: string, phone: string): string {
    if (phone === '') {
      return ''
    }
    const noSpaces = removeSpaces(phone)
    const re = new RegExp(`^\\+${prefix}`)
    return noSpaces.replace(re, '')
  }
  return {
    email: props.email,
    teamName: props.teamName,
    phoneNumber: sanitizePhoneNumber('65', props.phoneNumber),
    role: props.role,
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

export namespace sunnus {
  // export class Database {
  //   static readonly col = firestore(app).collection
  //   static readonly users: CollectionReference<DocumentData> = this.col('users')
  //   static readonly teams: CollectionReference<DocumentData> = this.col('teams')
  // }
  export class User {
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
    static async get(uid: string) {
      const ref = firestore()
        .collection('users')
        .doc(uid)
        .withConverter(this.converter)
      const docSnap = await ref.get()
      if (docSnap.exists) {
        return docSnap.data()
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
