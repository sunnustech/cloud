import axios from 'axios'
import { timestamp } from './utils/timestamp'
import { cloud } from './utils/firebase'

const fn = 'development-getQuarterfinalists'
timestamp(fn)

axios
  .post(cloud(fn), {
    message: 'please',
    sportList: [
      'dodgeball',
      'frisbee',
      'volleyball',
      'tchoukball',
      'touchRugby',
      'captainsBall',
    ],
  })
  .then((res) => {
    const data = res.data
    console.debug(data)
  })
