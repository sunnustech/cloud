import { sportList } from '../data/constants'
import { Timestamp } from '@google-cloud/firestore'
import { Sport } from '../types/TSS'
import { Init } from '../types/classes'
import { notEmpty } from '../utils/string'
import { stationOrder } from '../data/schema/SOAR'
import { firestore } from 'firebase-admin'
import { collection, rebuild } from './firebase'
import { QR } from './QR'

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
  async beginQRFunction() {
    this.updateTimestamp()
  }

  // at the end of every timer function
  async endQRFunction() {
    await collection.teams.doc(this.teamName).set(this)
    console.debug('successfully completed task')
  }

  /**
   * ensure that the team's started status is at the specified state
   */
  ensureStarted(b: boolean): boolean {
    if (this._started === b) {
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
  async startTimer(): Promise<string> {
    await this.beginQRFunction()
    if (!this.ensureStarted(false)) return 'already started'
    if (!this.ensureStopped(false)) return 'already stopped'
    if (!this.ensureTimerRunning(false)) return 'timer somehow already running'
    this._started = true
    this._timerRunning = true
    this._timerEvents.push(this.timestamp)
    this._startTime = this.timestamp
    await this.endQRFunction()
    return 'ok'
  }

  /**
   * stop the team's timer for the last time
   * can only be run once
   */
  async stopTimer(): Promise<string> {
    await this.beginQRFunction()
    if (!this.ensureInGame()) return 'not in game'
    if (!this.ensureTimerRunning(true)) return 'timer already paused'
    this._stopped = true
    this._timerRunning = false
    this._timerEvents.push(-this.timestamp)
    await this.endQRFunction()
    return 'ok'
  }

  /**
   * resume the team's timer
   */
  async resumeTimer(): Promise<string> {
    await this.beginQRFunction()
    if (!this.ensureInGame()) return 'not in game'
    if (!this.ensureTimerRunning(false)) return 'timer already running'
    this._timerRunning = true
    this._timerEvents.push(this.timestamp)
    await this.endQRFunction()
    return 'ok'
  }

  /**
   * pause the team's timer
   */
  async pauseTimer(): Promise<string> {
    await this.beginQRFunction()
    if (!this.ensureInGame()) return 'not in game'
    if (!this.ensureTimerRunning(true)) return 'timer already paused'
    this._timerRunning = false
    this._timerEvents.push(this.timestamp)
    await this.endQRFunction()
    return 'ok'
  }

  /**
   * reset Timer to before starting
   */
  async resetTimer(): Promise<string> {
    await this.beginQRFunction()
    this._timerRunning = false
    this._stopped = false
    this._started = false
    this._timerEvents = []
    await this.endQRFunction()
    return 'ok'
  }

  /**
   * complete a certain stage
   */
  async completeStage(stage: string): Promise<string> {
    await this.beginQRFunction()
    console.log('=======>', this._stationsRemaining)
    if (this._stationsRemaining.length === 0) {
      return 'already completed all stations'
    }
    if (!stationOrder['A'].includes(stage)) {
      return 'invalid station'
    }
    if (stage !== this._stationsRemaining[0]) {
      return 'wrong station'
    }
    // after this point, the stage is located at the zeroth index of
    // _stationsRemaining, so we can do the following safely:
    this._stationsCompleted.push(stage)
    this._stationsRemaining.shift()
    this._timerEvents.push(this.timestamp)
    await this.endQRFunction()
    return 'ok'
  }


  async task(qr: QR): Promise<string> {
    var m: string
    switch (qr.command) {
      case 'startTimer':
        m = await this.startTimer()
        break
      case 'resumeTimer':
        m = await this.resumeTimer()
        break
      case 'stopTimer':
        m = await this.stopTimer()
        break
      case 'pauseTimer':
        m = await this.pauseTimer()
        break
      case 'resetTimer':
        m = await this.resetTimer()
        break
      case 'completeStage':
        m = await this.completeStage(qr.station)
        break
      default:
        m = 'invalid command'
    }
    return m
  }

  displayTimeOffset() {
    const sum = this._timerEvents.reduce((a, b) => a + b, 0)
    return Math.abs(sum)
    // on frontend, the total elapsed time would then be
    // Math.abs(now.getTime() - <returned value>)
  }
}
