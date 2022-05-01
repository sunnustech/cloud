// import { firestore } from 'firebase-admin'
// import { sanitizePhoneNumber } from '../utils/string'
// import { FirestoreDataConverter } from '@google-cloud/firestore'
// import { SetOptions, WriteResult } from '@google-cloud/firestore'
import * as sunnus from '../types/classes'
// import { Sport } from '../types'
import { SOARTimestamp } from '../types/SOAR'

export class Team {
  members: string[]
  teamName: string
  constructor(props: sunnus.Init.Team) {
    this.teamName = props.teamName
    this.members = []
  }
}

export class SOARTeam extends Team {
  started: boolean
  stopped: boolean
  startTime: number
  stopTime: number
  timerRunning: boolean
  allEvents: Array<SOARTimestamp>
  direction: 'A' | 'B'
  points: number
  timerEvents: number[]
  start: number
  pausedAt: number
  stationsCompleted: string[]
  stationsRemaining: string[]
  constructor()

}
