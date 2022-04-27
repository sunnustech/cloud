import { Sport, Round } from '../types/index'

export const sportList: Array<Sport> = [
  'dodgeball',
  'frisbee',
  'volleyball',
  'tchoukball',
  'touchRugby',
  'captainsBall',
]

export const roundList: Array<Round> = [
  'round_of_32',
  'round_of_16',
  'quarterfinals',
  'semifinals',
  'finals',
]

export const reversedRoundList: Array<Round> = [
  'finals',
  'semifinals',
  'quarterfinals',
  'round_of_16',
  'round_of_32',
]

export const sportCapacity: Record<Sport, number> = {
  dodgeball: 16,
  frisbee: 24,
  volleyball: 16,
  tchoukball: 16,
  touchRugby: 20,
  captainsBall: 20,
}
