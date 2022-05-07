import { sportList } from '../data/constants'
import { Timestamp } from '@google-cloud/firestore'
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
    console.debug('successfully completed task')
  }


  /**
   * ensure that the team's started status is at the specified state
   */
  ensureStarted(b: boolean): boolean {
    if (this._started === b) {
      console.log('GOT HERE', this._started)
      return true
    }
    console.warn(
      b === true
        ? 'this team has not started yet'
        : 'this team has already started'
    )
    return false
  }

  /**
   * ensure that the team's stopped status is at the specified state
   */
  ensureStopped(b: boolean): boolean {
    if (this._stopped === b) {
      return true
    }
    console.warn(
      b === true
        ? 'this team has not stopped yet'
        : 'this team has already stopped'
    )
    return false
  }

  /**
   * ensure that the team's timer is at the specified state
   */
  ensureTimerRunning(b: boolean): boolean {
    if (this._timerRunning === b) {
      return true
    }
    console.warn(
      b === true
        ? "this team's timer is not running yet"
        : "this team's timer is already running"
    )
    return false
  }

  /**
   * ensure that the team has started but not stopped yet
   */
  ensureInGame(): boolean {
    return this.ensureStarted(true) && this.ensureStopped(false)
  }

  /**
   * start the team's timer for the first time
   * can only be run once
   */
  async startTimer() {
    console.log("GOT HERE")
    console.log(typeof this.beginTimerFunction)
    await this.beginTimerFunction()
    if (!this.ensureStarted(false)) return
    if (!this.ensureStopped(false)) return
    if (!this.ensureTimerRunning(false)) return
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
    if (this.ensureInGame()) return
    if (!this.ensureTimerRunning(true)) return
    this._stopped = true
    this._timerRunning = false
    this._timerEvents.push(-this.timestamp)
    await this.endTimerFunction()
  }

  /**
   * resume the team's timer
   */
  async resumeTimer() {
    await this.beginTimerFunction()
    if (!this.ensureInGame()) return
    if (!this.ensureTimerRunning(false)) return
    this._timerRunning = true
    this._timerEvents.push(this.timestamp)
    await this.endTimerFunction()
  }

  /**
   * pause the team's timer
   */
  async pauseTimer() {
    await this.beginTimerFunction()
    if (!this.ensureInGame()) return
    if (!this.ensureTimerRunning(true)) return
    this._timerRunning = false
    this._timerEvents.push(this.timestamp)
    await this.endTimerFunction()
  }

  displayTimeOffset() {
    const sum = this._timerEvents.reduce((a, b) => a + b, 0)
    return Math.abs(sum)
    // on frontend, the total elapsed time would then be
    // Math.abs(now.getTime() - <returned value>)
  }
}
