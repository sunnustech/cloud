import { SOARLocation } from "../../../types/SOAR" 

const Slide: SOARLocation = {
  google_map_pin_url: 'https://goo.gl/maps/T1F9XPH1bCcAW1bJA',
  id: 1,
  location: 'TODO',
  physical: true,
  stage: 1,
  stationType: 'game',
  status: '',
  timetable: [],
  title: 'Slide',
  content: {
    game_title: 'Slide',
    details: 'TODO',
  },
  coordinate: {
    latitude: 1.2959918,
    longitude: 103.780516,
  },
}

const Relay2Maze: SOARLocation = {
  google_map_pin_url: 'https://goo.gl/maps/sBkDifkxaduGabCA9',
  id: 2,
  location: 'TODO',
  physical: true,
  stage: 1,
  stationType: 'game',
  status: '',
  timetable: [],
  title: 'Relay2Maze',
  content: {
    game_title: 'Relay2Maze',
    details: 'TODO',
  },
  coordinate: {
    latitude: 1.2995528,
    longitude: 103.7756084,
  },
}

const SotongHouze: SOARLocation = {
  google_map_pin_url: 'https://goo.gl/maps/PQswbYKbSRPiDs2C8',
  id: 3,
  location: 'TODO',
  physical: true,
  stage: 1,
  stationType: 'game',
  status: '',
  timetable: [],
  title: 'Sotong Houze',
  content: {
    game_title: 'Sotong Houze',
    details: 'TODO',
  },
  coordinate: {
    latitude: 1.2967515,
    longitude: 103.7701697,
  },
}

const SnakeAndLadders: SOARLocation = {
  google_map_pin_url: 'https://goo.gl/maps/VtG7da41VpvUsrM3A',
  id: 4,
  location: 'TODO',
  physical: true,
  stage: 1,
  stationType: 'game',
  status: '',
  timetable: [],
  title: 'Snake and Ladders',
  content: {
    game_title: 'Snake and Ladders',
    details: 'TODO',
  },
  coordinate: {
    latitude: 1.2935693,
    longitude: 103.7740868,
  },
}

const GOLF: SOARLocation = {
  google_map_pin_url: 'https://goo.gl/maps/zNsCz9JE63cvDtr3A',
  id: 5,
  location: 'TODO',
  physical: true,
  stage: 1,
  stationType: 'game',
  status: '',
  timetable: [],
  title: 'GOLF',
  content: {
    game_title: 'GOLF',
    details: 'TODO',
  },
  coordinate: {
    latitude: 1.3050392,
    longitude: 103.7729745,
  },
}

const NerfBattle: SOARLocation = {
  google_map_pin_url: 'https://goo.gl/maps/iDqREtXgp2swi15DA',
  id: 6,
  location: 'TODO',
  physical: true,
  stage: 1,
  stationType: 'game',
  status: '',
  timetable: [],
  title: 'Nerf Battle',
  content: {
    game_title: 'Nerf Battle',
    details: 'TODO',
  },
  coordinate: {
    latitude: 1.2966335,
    longitude: 103.7728345,
  },
}

const gameLocations: Array<SOARLocation> = [
  Slide,
  Relay2Maze,
  SotongHouze,
  SnakeAndLadders,
  GOLF,
  NerfBattle,
]

const gameLocationObject: Record<string, any> = {
  Slide,
  Relay2Maze,
  SotongHouze,
  SnakeAndLadders,
  GOLF,
  NerfBattle,
}

export default gameLocations
export { gameLocationObject }
