import { Response } from 'express'
import { parse } from 'csv-parse/sync'
import { isSubset } from './exits'
import * as sunnus from '../classes'

export const getCsvHeadersFromString = (string: string): string[] => {
  const result: string[][] = parse(string, {
    delimiter: ',',
    trim: true,
    to: 2,
  })
  return result[0]
}

export const getUsersFromCsv = (userListCsv: string): sunnus.User[] => {
  const parsedCsv: sunnus.User[]  = parse(userListCsv, {
    delimiter: ',',
    trim: true,
    columns: true,
  })
  return parsedCsv.map((initializeUser) => new sunnus.User(initializeUser))
}

export function hasMissingHeaders(
  requiredHeaders: string[],
  userListCsvString: string,
  res: Response<any>
): boolean {
  const headers = getCsvHeadersFromString(userListCsvString)
  const hasMissing: boolean = !isSubset(
    requiredHeaders,
    headers,
    'Check that all headers are provided.',
    res
  )
  return hasMissing
}
