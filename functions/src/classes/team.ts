import { sportList } from '../data/constants'
import { Timestamp } from '@google-cloud/firestore'
import { Sport } from '../types/TSS'
import { Init } from '../types/classes'
import { notEmpty } from '../utils/string'
import { stationOrder, stations } from '../data/schema/SOAR'
import { firestore } from 'firebase-admin'
import { collection, rebuild } from './firebase'
import { QR } from './QR'

type SportFlexible = Sport | 'none' | 'more than 1'

export class Team {
  members: string[]
  timestamp: number
  teamName: string
  direction: 'A' | 'B'
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
   * @param {Init.Team} props
   * @return {SportFlexible} result
   */
  private static getSport(props: Init.Team): SportFlexible {
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
   * @param {Init.Team} props
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

  /**
   * @param {SportFlexible} sport
   */
  setSport(sport: SportFlexible) {
    this.sport = sport
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
   * @param {boolean} b
   * @return {boolean}
   */
  ensureStarted(b: boolean): boolean {
    if (this._started === b) {
      return true
    }
    console.warn(
      b === true ?
        'this team has not started yet' :
        'this team has already started'
    )
    return false
  }

  /**
   * ensure that the team's stopped status is at the specified state
   * @param {boolean} b
   * @return {boolean}
   */
  ensureStopped(b: boolean): boolean {
    if (this._stopped === b) {
      return true
    }
    console.warn(
      b === true ?
        'this team has not stopped yet' :
        'this team has already stopped'
    )
    return false
  }

  /**
   * ensure that the station is a valid one
   * @param {string} station
   * @return {boolean}
   */
  ensureValidStation(station: string): boolean {
    return stations.includes(station)
  }

  /**
   * ensure that the team is at the right station
   * @param {string} station
   * @return {boolean}
   */
  ensureCorrectStation(station: string): boolean {
    const rem = this._stationsRemaining
    if (rem.length === 0) {
      return false
    }
    return station === this._stationsRemaining[0]
  }

  /**
   * ensure that the team's timer is at the specified state
   * @param {boolean} b
   * @return {boolean}
   */
  ensureTimerRunning(b: boolean): boolean {
    if (this._timerRunning === b) {
      return true
    }
    console.warn(
      b === true ?
        'this team\'s timer is not running yet' :
        'this team\'s timer is already running'
    )
    return false
  }

  /**
   * ensure that the team has started but not stopped yet
   * @return {boolean}
   */
  ensureInGame(): boolean {
    return this.ensureStopped(false) && this.ensureStarted(true)
  }

  /**
   * ensure that the team has completed all stations
   * @return {boolean}
   */
  ensureAllDone(): boolean {
    return this._stationsRemaining.length === 0
  }

  /**
   * start the team's timer for the first time
   * can only be run once
   * @param {QR} qr code
   * @return {Promise<string>}
   */
  async startTimer(qr: QR): Promise<string> {
    await this.beginQRFunction()
    // checks
    if (!this.ensureStopped(false)) return 'already stopped'
    if (!this.ensureStarted(false)) return 'already started'
    if (!this.ensureTimerRunning(false)) return 'timer somehow already running'
    if (!this.ensureValidStation(qr.station)) return 'invalid station'
    if (!this.ensureCorrectStation(qr.station)) return 'wrong station'
    // writes
    this._started = true
    this._timerRunning = true
    this._timerEvents.push(this.timestamp)
    this._startTime = this.timestamp
    await this.endQRFunction()
    return 'ok'
  }

  /**
   * resume the team's timer
   * @return {Promise<string>}
   */
  async resumeTimer(): Promise<string> {
    await this.beginQRFunction()
    // checks
    if (!this.ensureInGame()) return 'not in game'
    if (!this.ensureTimerRunning(false)) return 'timer already running'
    // writes
    this._timerRunning = true
    this._timerEvents.push(this.timestamp)
    await this.endQRFunction()
    return 'ok'
  }

  /**
   * pause the team's timer
   * @return {Promise<string>}
   */
  async pauseTimer(): Promise<string> {
    await this.beginQRFunction()
    // checks
    if (!this.ensureInGame()) return 'not in game'
    if (!this.ensureTimerRunning(true)) return 'timer already paused'
    // writes
    this._timerRunning = false
    this._timerEvents.push(-this.timestamp)
    await this.endQRFunction()
    return 'ok'
  }


  /**
   * stop the team's timer for the last time
   * can only be run once
   * @return {Promise<string>}
   */
  async stopTimer(): Promise<string> {
    await this.beginQRFunction()
    // checks
    if (!this.ensureInGame()) return 'not in game'
    if (!this.ensureTimerRunning(true)) return 'timer already paused'
    if (!this.ensureAllDone()) return 'have not completed all stations'
    // writes
    this._stopped = true
    this._timerRunning = false
    this._timerEvents.push(-this.timestamp)
    await this.endQRFunction()
    return 'ok'
  }

  /**
   * forcefully stop the team's timer for the last time
   * even when there are stations that haven't been completed
   * can only be run once
   * @return {Promise<string>}
   */
  async forceStopTimer(): Promise<string> {
    await this.beginQRFunction()
    // checks
    if (!this.ensureInGame()) return 'not in game'
    if (!this.ensureTimerRunning(true)) return 'timer already paused'
    // writes
    this._stopped = true
    this._timerRunning = false
    this._timerEvents.push(-this.timestamp)
    await this.endQRFunction()
    return 'ok'
  }
  /**
   * complete a certain stage
   * @param {QR} qr
   * @return {Promise<string>}
   */
  async completeStage(qr: QR): Promise<string> {
    await this.beginQRFunction()
    // checks
    if (!this.ensureInGame()) return 'not in game'
    if (this.ensureAllDone()) return 'already completed all stations'
    if (!this.ensureValidStation(qr.station)) return 'invalid station'
    if (!this.ensureCorrectStation(qr.station)) return 'wrong station'
    // after this point, the stage is located at the zeroth index of
    // _stationsRemaining, so we can do the following safely:
    this._points += qr.points
    this._stationsCompleted.push(qr.station)
    this._stationsRemaining.shift()
    await this.endQRFunction()
    return 'ok'
  }

  /**
   * add points to the team
   * @param {QR} qr
   * @return {Promise<string>}
   */
  async addPoints(qr: QR): Promise<string> {
    await this.beginQRFunction()
    if (!this.ensureInGame()) return 'not in game'
    this._points += qr.points
    await this.endQRFunction()
    return 'ok'
  }

  /**
   * reset Timer to before starting
   * @return {Promise<string>}
   */
  async resetTeam(): Promise<string> {
    await this.beginQRFunction()
    this._timerRunning = false
    this._stopped = false
    this._started = false
    this._stationsCompleted = []
    this._stationsRemaining = stationOrder[this.direction]
    this._points = 0
    this._timerEvents = []
    await this.endQRFunction()
    return 'ok'
  }

  /**
   * handles an incoming QR class
   * @param {QR} qr
   * @return {Promise<string>}
   */
  async task(qr: QR): Promise<string> {
    let m: string
    switch (qr.command) {
    case 'startTimer':
      m = await this.startTimer(qr)
      break
    case 'resumeTimer':
      m = await this.resumeTimer()
      break
    case 'stopTimer':
      m = await this.stopTimer()
      break
    case 'forceStopTimer':
      m = await this.forceStopTimer()
      break
    case 'pauseTimer':
      m = await this.pauseTimer()
      break
    case 'resetTeam':
      m = await this.resetTeam()
      break
    case 'completeStage':
      m = await this.completeStage(qr)
      break
    case 'addPoints':
      m = await this.addPoints(qr)
      break
    default:
      m = 'invalid command'
    }
    return m
  }

  /**
   * find out how much time the team didn't spend since start
   * @return {number}
   */
  displayTimeOffset(): number {
    const sum = this._timerEvents.reduce((a, b) => a + b, 0)
    return Math.abs(sum)
    // on frontend, the total elapsed time would then be
    // Math.abs(now.getTime() - <returned value>)
  }
}
