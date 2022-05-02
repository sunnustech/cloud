import axios from 'axios'
import { timestamp } from '../utils/timestamp'
import { cloud } from '../utils/firebase'
import fs from 'fs'

export function create(entity: string, key: string) {
  const fileData = fs.readFileSync(`src/csv/create${entity}.csv`)
  const fn = `development-create${entity}`
  timestamp(fn)
  axios.post(cloud(fn), { [key]: fileData.toString() }).then((res) => {
    const data = res.data
    console.debug(data)
  })
}
