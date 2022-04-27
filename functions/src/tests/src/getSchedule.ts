import axios from 'axios'
import { timestamp } from './utils/timestamp'
import { cloud } from './utils/firebase'
import { Event } from '../../types/schedule'

const fn = 'development-getSchedule'
timestamp(fn)

const filter: Partial<Event> = {
  sport: 'volleyball',
}

axios.post(cloud(fn), { filter }).then((res) => {
  const data = res.data
  console.debug(data)
})
