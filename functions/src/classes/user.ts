import { firestore } from 'firebase-admin'
import { sanitizePhoneNumber } from '../utils/string'
import { SetOptions, WriteResult } from '@google-cloud/firestore'
import { Init } from '../types/classes'
import { converter } from './firebase'

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
  static async get(uid: string): Promise<User> {
    const ref = firestore()
      .collection('users')
      .doc(uid)
      .withConverter(converter.user)
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
      .withConverter(converter.user)
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
