import { parse } from 'csv-parse/sync'

export const readRoundRobinConfig = (fileData: Buffer) => {
  const config: any = {
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
