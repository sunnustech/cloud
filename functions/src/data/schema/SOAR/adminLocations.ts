import { SOARLocation } from "../../../types/SOAR"

const waterPoints: Array<SOARLocation> = [
  {
    google_map_pin_url: '',
    id: 10,
    location: '',
    physical: true,
    stage: 0,
    stationType: 'water',
    status: '',
    timetable: [],
    title: '_UTown Green',
    content: {
      game_title: '',
      details: '',
    },
    coordinate: {
      // UTown Green
      latitude: 1.3049891103654925,
      longitude: 103.77322845557454,
    },
  },
  {
    google_map_pin_url: '',
    id: 20,
    location: '',
    physical: true,
    stage: 0,
    stationType: 'water',
    status: '',
    timetable: [],
    title: '_NUH',
    content: {
      game_title: '',
      details: '',
    },
    coordinate: {
      // NUH
      latitude: 1.2941740290024657,
      longitude: 103.78306481546151,
    },
  },
]

const adminLocations: Array<SOARLocation> = [...waterPoints]

export default adminLocations
