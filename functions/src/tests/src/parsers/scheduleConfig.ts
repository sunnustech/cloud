import { parse } from 'csv-parse/sync'
import { ScheduleConfig } from '../../../types/delete-me-after-done-with-schedule-thanks'

const True: Record<string, boolean> = {
  yes: true,
  true: true,
}

const False: Record<string, boolean> = {
  no: true,
  false: true,
}

export const readScheduleConfig = (fileData: Buffer): ScheduleConfig =>
  parse(fileData, {
    delimiter: ',',
    fromLine: 2,
    trim: true,
    groupColumnsByName: true,
    objname: 'sport',
    columns: [
      'sport',
      'matchLength',
      'matchBreak',
      'density',
      'venue',
      'courts',
      'courts',
      'courts',
      'courts',
      'startTime',
      'lunchStart',
      'lunchEnd',
      'alternating',
    ],
    cast: (value) => {
      if (True[value]) {
        return true
      }
      if (False[value]) {
        return false
      }
      if (value.includes(':')) {
        // is a HH:MM string
        return value
      }
      const int = parseInt(value)
      if (!isNaN(int)) {
        return int
      }
      return value
    },
    onRecord: (rec) => {
      const config = rec[1]
      config.matchInterval = config.matchLength + config.matchBreak
      // handle empty courts
      config.courts = config.courts.filter((e: string) => e !== '')
      delete config.matchBreak
      delete config.sport
      return rec
    },
  })
