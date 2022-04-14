import axios from 'axios'
import { timestamp } from './utils/timestamp'
import { cloud } from './utils/firebase'

import fs from 'fs'
import { ScheduleConfig } from '../../types/schedule'
import { readRoundRobinConfig } from './parsers/roundRobinConfig'
import { readScheduleConfig } from './parsers/scheduleConfig'

const fn = 'development-createSchedule'
timestamp(fn)

// axios.post(cloud(fn), { scheduleConfig, roundRobinConfig }).then((res) => {
// const data = res.data
// console.log(data)
// })
//
const foo = {
  asdf: 'one',
  fdsa: 'two',
  qwer: 'three',
}
console.log(Object.entries(foo))
