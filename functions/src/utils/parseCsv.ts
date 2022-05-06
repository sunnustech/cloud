import { Response } from 'express'
import { parse } from 'csv-parse/sync'
import { isSubset } from './exits'
import { User } from '../classes/user'
import { BaseTeam } from '../classes/team'
import { Init } from '../types/classes'

export const getCsvHeadersFromString = (string: string): string[] => {
  const result: string[][] = parse(string, {
    delimiter: ',',
    trim: true,
    to: 2,
  })
  if (result.length === 0) {
    return []
  }
  return result[0]
}

const getFromCsv = <T>(csv: string): T[] => {
  const parsedCsv = parse(csv, {
    delimiter: ',',
    trim: true,
    columns: true,
  })
  return parsedCsv
}

export const getUsersFromCsv = (csv: string) => {
  const parsed = getFromCsv<Init.User>(csv)
  return parsed.map((e) => new User(e))
}

export const getTeamsFromCsv = (csv: string) => {
  const parsed = getFromCsv<Init.Team>(csv)
  return parsed.map((e) => new BaseTeam(e))
}

export function hasMissingHeaders(
  requiredHeaders: string[],
  csv: string,
  res: Response<any>
): boolean {
  const headers = getCsvHeadersFromString(csv)
  const hasMissing = !isSubset(
    requiredHeaders,
    headers,
    'Check that all headers are provided.',
    res
  )
  return hasMissing
}
