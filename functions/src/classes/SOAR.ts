import * as sunnus from '../types/classes'
import { SOARTimestamp } from '../types/SOAR'
import { QR } from './QR'

type HaventDecided =
  | 'fn01'
  | 'fn02'
  | 'fn03'
  | 'fn04'
  | 'fn05'
  | 'fn06'
  | 'fn07'
  | 'fn08'
  | 'fn09'
  | 'fn10'
  | 'fn11'
  | 'fn12'
  | 'fn13'
  | 'fn14'
  | 'fn15'
  | 'fn16'
  | 'fn17'
  | 'fn18'
  | 'fn19'
  | 'fn20'

export namespace SOAR {
  export type Timestamp = {
    timestamp: number
    QR: QR.CommandProps
  }
  export type Command =
    | 'start'
    | 'pause'
    | 'stopFinal'
    | 'resume'
    | 'TimerNotRunning'
    | 'completeStage'
    | 'WrongStation'
    | 'HaveNotStartedSOAR'
    | 'AlreadyPaused'
    | 'AlreadyResumed'
    | 'AlreadyStartedSOAR'
    | 'AlreadyCompletedSOAR'
    | 'AlreadyCompletedAllStations'
    | 'AlreadyCompletedStation'
    | 'WarnStopFinal'
    | ''
    | HaventDecided
  export const stationOrder = {
    A: [
      'Slide',
      'Sotong Houze',
      'Nerf Battle',
      'Snake and Ladders',
      'GOLF',
      'Relay2Maze',
    ],
    B: [
      'GOLF',
      'Snake and Ladders',
      'Nerf Battle',
      'Sotong Houze',
      'Slide',
      'Relay2Maze',
    ],
  }
  export class Team extends sunnus.Team {
    started: boolean
    stopped: boolean
    startTime: number
    stopTime: number
    timerRunning: boolean
    allEvents: SOARTimestamp[]
    points: number
    timerEvents: number[]
    start: number
    pausedAt: number
    stationsCompleted: string[]
    stationsRemaining: string[]
    direction: 'A' | 'B'
    constructor(props: sunnus.Init.SOARTeam) {
      super({ teamName: props.teamName })
      this.direction = props.direction
      this.started = false
      this.stopped = false
      this.startTime = 0
      this.stopTime = 0
      this.timerRunning = false
      this.allEvents = []
      this.points = 0
      this.timerEvents = []
      this.start = 0
      this.pausedAt = 0
      this.stationsCompleted = []
      this.stationsRemaining = stationOrder[props.direction]
    }
  }
}
