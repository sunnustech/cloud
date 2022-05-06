import axios from 'axios'
import { timestamp } from './utils/timestamp'
import { cloud } from './utils/firebase'

const fn = 'development-getSchedule'
timestamp(fn)

const filter = {
  sport: 'volleyball',
}

axios.post(cloud(fn), { filter }).then((res) => {
  const data = res.data
  console.debug(data)
})
