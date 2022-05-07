import { sportList } from '../data/constants'
import { FirestoreDataConverter, Timestamp } from '@google-cloud/firestore'
import { Sport } from '../types/TSS'
import { Init } from '../types/classes'
import { notEmpty } from '../utils/string'
import { stationOrder } from '../data/schema/SOAR'
import { firestore } from 'firebase-admin'

type SportFlexible = Sport | 'none' | 'more than 1'

export class Team {
  members: string[]
  teamName: string
  direction: string
  sport: SportFlexible
  _started: boolean
  _stopped: boolean
  _startTime: number
  _stopTime: number
  _timerRunning: boolean
  _allEvents: Timestamp[]
  _direction: 'A' | 'B'
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
   * converts this class to firestore friendly data
   */
  static converter: FirestoreDataConverter<Team> = {
    toFirestore: (team: Team) => {
      return {
        members: team.members,
        teamName: team.teamName,
        direction: team.direction,
        sport: team.sport,
      }
    },
    fromFirestore: (snapshot) => {
      const data = snapshot.data()
      const team = new Team({
        teamName: data.teamName,
        direction: data.direction,
        captainsBall: '',
        dodgeball: '',
        frisbee: '',
        tchoukball: '',
        touchRugby: '',
        volleyball: '',
      })
      team.setSport(data.sport)
      return team
    },
  }

  /**
   * instantiate this class
   */
  constructor(props: Init.Team) {
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
    this._direction = 'A'
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

  startTimer() {
    this._started = true
    console.log(firestore.FieldValue.serverTimestamp())
    this._timerRunning = true
  }

  displayTimeOffset() {
    const sum = this._timerEvents.reduce((a, b) => a + b, 0)
    return Math.abs(sum)
    // on frontend, the total elapsed time would then be
    // Math.abs(now.getTime() - <returned value>)
  }
}
