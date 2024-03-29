import axios from 'axios'
import { timestamp } from './utils/timestamp'
import { cloud } from './utils/firebase'

import fs from 'fs'
import { readRoundRobinConfig } from './parsers/roundRobinConfig'
import { readScheduleConfig } from './parsers/scheduleConfig'

const fn = 'development-createSchedule'
timestamp(fn)

const filenames = ['src/csv/scheduleConfig.csv', 'src/csv/roundRobinConfig.csv']
const buffers = filenames.map((f) => fs.readFileSync(f))
const scheduleConfig = readScheduleConfig(buffers[0])
const roundRobinConfig = readRoundRobinConfig(buffers[1])

axios.post(cloud(fn), { scheduleConfig, roundRobinConfig, debugScores: true }).then((res) => {
  const data = res.data
  console.debug(data)
})
