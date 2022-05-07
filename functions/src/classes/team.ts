import { sportList } from '../data/constants'
import { DocumentData, Timestamp } from '@google-cloud/firestore'
import { Sport } from '../types/TSS'
import { Init } from '../types/classes'
import { notEmpty } from '../utils/string'
import { stationOrder } from '../data/schema/SOAR'
import { firestore } from 'firebase-admin'
import { collection, rebuild } from './firebase'

type SportFlexible = Sport | 'none' | 'more than 1'

export class Team {
  members: string[]
  timestamp: number
  teamName: string
  direction: string
  sport: SportFlexible
  _started: boolean
  _stopped: boolean
  _startTime: number
  _stopTime: number
  _timerRunning: boolean
  _allEvents: Timestamp[]
  _points: number
  _timerEvents: number[]
  _start: number
  _pausedAt: number
  _stationsCompleted: string[]
  _stationsRemaining: string[]

  /**
   * grabs the sport and populates this.sport
   * based on csv values
   */
  private static getSport(props: Init.Team) {
    let result: SportFlexible = 'none'
    const sportsSignedUp = sportList
      .map((sport) => {
        const signedUp = notEmpty(props[sport])
        if (signedUp) {
          result = sport
        }
        return signedUp
      })
      .filter((s) => s === true).length

    if (sportsSignedUp > 1) {
      return 'more than 1'
    }
    return result
  }

  /**
   * instantiate this class
   */
  constructor(props: Init.Team) {
    this.timestamp = 0
    this.teamName = props.teamName
    this.members = []
    this.sport = Team.getSport(props)
    this.direction = props.direction
    this._started = false
    this._stopped = false
    this._startTime = 0
    this._stopTime = 0
    this._timerRunning = false
    this._allEvents = []
    this._points = 0
    this._timerEvents = []
    this._start = 0
    this._pausedAt = 0
    this._stationsCompleted = []
    this._stationsRemaining = stationOrder[props.direction]
  }

  setSport(value: SportFlexible) {
    this.sport = value
  }

  async fetch() {
    const snapshot = await collection.teams.doc(this.teamName).get()
    if (!snapshot.exists) {
      console.debug('Team class: Unable to fetch team data')
      return
    }
    const data = snapshot.data()
    if (!data) {
      console.debug('Team class: Unable to parse team data')
      return
    }
    rebuild.team(data, this)
  }

  updateTimestamp() {
    this.timestamp = firestore.Timestamp.now().toMillis()
  }

  // at the start of every timer function
  async beginTimerFunction() {
    this.updateTimestamp()
    await this.fetch()
  }

  // at the end of every timer function
  async endTimerFunction() {
    await collection.teams.doc(this.teamName).set(this)
  }

  /**
   * start the team's timer for the first time
   * can only be run once
   */
  async startTimer() {
    await this.beginTimerFunction()
    this._started = true
    this._timerRunning = true
    this._timerEvents.push(this.timestamp)
    this._startTime = this.timestamp
    await this.endTimerFunction()
  }

  /**
   * stop the team's timer for the last time
   * can only be run once
   */
  async stopTimer() {
    await this.beginTimerFunction()
    this._stopped = true
    this._timerRunning = false
    this._timerEvents.push(-this.timestamp)
    this._startTime = this.timestamp
    await this.endTimerFunction()
  }


  displayTimeOffset() {
    const sum = this._timerEvents.reduce((a, b) => a + b, 0)
    return Math.abs(sum)
    // on frontend, the total elapsed time would then be
    // Math.abs(now.getTime() - <returned value>)
  }
}
