import { Sport, Round } from '../types/TSS'

export const sportList: Array<Sport> = [
  'dodgeball',
  'frisbee',
  'volleyball',
  'tchoukball',
  'touchRugby',
  'captainsBall',
]

export const roundList: Array<Round> = [
  'quarterfinals',
  'semifinals',
  'finals',
]

export const reversedRoundList: Array<Round> = [
  'finals',
  'semifinals',
  'quarterfinals',
]

export const sportCapacity: Record<Sport, number> = {
  dodgeball: 16,
  frisbee: 24,
  volleyball: 16,
  tchoukball: 16,
  touchRugby: 20,
  captainsBall: 20,
}

export const eventKeys: string[] = [
  'start',
  'end',
  'sport',
  'venue',
  'court',
  'round',
  'A',
  'B',
  'idA',
  'idB',
  'completed',
  'winner',
]
