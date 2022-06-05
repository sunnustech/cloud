import { Response } from 'express'
import { parse } from 'csv-parse/sync'
import { isSubset } from './exits'
import { User } from '../classes/user'
import { Team } from '../classes/team'
import { Init } from '../types/classes'

/**
 * Obtains the headers from the csv file, assuming that it exists
 * 
 * @param {string} string csv content passed in as a string
 * @returns {string[]} an array that represents the parts of the header
 */
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

/**
 * Returns csv content in a hashmap form
 * For more information, read https://csv.js.org/parse/api/sync/
 * 
 * @param {string} csv csv content passed in as a string
 * @returns {any} hashmap containing csv records
 */
const getFromCsv = <T>(csv: string): T[] => {
  const parsedCsv = parse(csv, {
    delimiter: ',',
    trim: true,
    columns: true,
  })
  return parsedCsv
}

/**
 * Creates user objects from the fields in the csv
 * 
 * @param {string} csv csv content passed in as a string
 * @returns {Init.User[]} an array of users obtained from the csv
 */
export const getUsersFromCsv = (csv: string) => {
  const parsed = getFromCsv<Init.User>(csv)
  return parsed.map((e) => new User(e))
}

/**
 * Creates team objects from the fields in the csv
 * 
 * @param {string} csv csv content passed in as a string
 * @returns {Init.Team[]} an array of teams obtained from the csv
 */
export const getTeamsFromCsv = (csv: string) => {
  const parsed = getFromCsv<Init.Team>(csv)
  return parsed.map((e) => new Team(e))
}

/**
 * Checks if the csv file has missing headers
 * 
 * @param {string[]} requiredHeaders list of headers to check against
 * @param {string} csv csv content passed in as a string
 * @param {Respone<any>} res response object containing json for feedback messages
 * @returns {boolean} whether or not there are missing headers
 */
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
