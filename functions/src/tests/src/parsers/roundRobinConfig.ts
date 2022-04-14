import { parse } from 'csv-parse/sync'
import { RoundRobinConfig } from '../../../types/schedule'

export const readRoundRobinConfig = (fileData: Buffer): RoundRobinConfig => {
  const config: RoundRobinConfig = {
    4: [], 5: [], 6: []
  }
  parse(fileData, {
    fromLine: 2,
    delimiter: ',',
    trim: true,
    groupColumnsByName: true,
    columns: ['4', '4', '5', '5', '6', '6'],
    cast: (value) => {
      const int = parseInt(value)
      if (!isNaN(int)) {
        return int
      }
      return value
    },
    onRecord: (record) => {
      const keys = Object.keys(record)
      keys.forEach((key: string) => {
        const pair = record[key]
        if (!pair.includes('')) {
          config[parseInt(key)].push(pair)
        }
      })
      return record
    },
  })
  return config
}

// local testing
// import fs from 'fs'
// const file = fs.readFileSync('src/csv/roundRobinConfig.csv')
// const data = readRoundRobinConfig(file)
// console.log(data)
