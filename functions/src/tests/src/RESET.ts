import axios from 'axios'
import { timestamp } from './utils/timestamp'
import { cloud } from './utils/firebase'

/**
 * currently, this resets the following collections to a development state:
 *   - users
 *   - teams
 *   - schedule
 */

timestamp('RESET DATABASE')
function clear(collection: string) {
  axios
    .post(cloud('development-clearCollection'), {
      message: 'please',
      collection,
      whitelist: ['__init__'],
    })
    .then((res) => {
      const data = res.data
      console.debug(data)
    })
}

// clear schedule
clear('schedule')
// clear teams
clear('teams')
// clear users
axios
  .post(cloud('development-deleteAllUsers'), { message: 'please' })
  .then((res) => {
    const data = res.data
    console.debug(data)
  })
