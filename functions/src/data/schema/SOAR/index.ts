import { SOARDatabase } from '../../../types/SOAR'
import gameLocations from './gameLocations'
import adminLocations from './adminLocations'

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

const SOAR: SOARDatabase = {
  locations: {
    data: [...gameLocations, ...adminLocations],
    stationOrder,
  },
}

export default SOAR
