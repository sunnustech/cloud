export type SOARTimetable = Array<{
  time: string
  teamName: string
}>

type SOARLocationStatus = '' | 'next' | 'done'

type Coordinate = {
  latitude: number
  longitude: number
}

export type SOARLocation = {
  google_map_pin_url: string
  id: number
  location: string
  physical: boolean
  stage: number
  stationType: string
  status: SOARLocationStatus
  timetable: Array<any>
  title: string
  content: {
    game_title: string
    details: string
  }
  coordinate: Coordinate
}

export type SOARDatabase = {
  locations: {
    data: Array<SOARLocation>
    stationOrder: {
      A: Array<string>
      B: Array<string>
    }
  }
}

export type SOARCommand =
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

export type SOARStations =
  | 'Slide'
  | 'Sotong Houze'
  | 'Nerf Battle'
  | 'Snake and Ladders'
  | 'GOLF'
  | 'Relay2Maze'

export type SOARScores =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | '15'
  | '16'
  | '17'
  | '18'
  | '19'
  | '20'

// Placeholder
export type SOARFacilitators = 'khang' | 'benjy'

export type QRRequest = {
  event: SOARStations
  action: SOARCommand
  facilitator: string
  score: SOARScores
}

export type StationOrderProps = {
  A: Array<string>
  B: Array<string>
}

export type SOARFilterProps = {
  game: boolean
  water: boolean
  medic: boolean
}

export type SOARTimestamp = {
  timestamp: number
  QR: QRCommandProps
}

export type SOARTeamProps = {
  started: boolean
  stopped: boolean
  startTime: number
  stopTime: number
  timerRunning: boolean
  allEvents: SOARTimestamp[]
  direction: 'A' | 'B'
  points: number
}
