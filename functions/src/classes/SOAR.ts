import * as sunnus from '../types/classes'
import { BaseTeam } from './team'
import { SOARTimestamp } from '../types/SOAR'
import { QR } from './QR'

export namespace SOAR {
  export type Timestamp = {
    timestamp: number
    QR: QR.CommandProps
  }
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
  export class Team extends BaseTeam {
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
    constructor(props: sunnus.Init.Team) {
      super({
        teamName: props.teamName,
        direction: props.direction,
        touchRugby: props.touchRugby,
        captainsBall: props.captainsBall,
        volleyball: props.volleyball,
        tchoukball: props.tchoukball,
        frisbee: props.frisbee,
        dodgeball: props.dodgeball,
      })
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
