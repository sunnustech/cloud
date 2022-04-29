import { InitializeUser } from '../types/sunnus-init'
import { parse } from 'csv-parse/sync'

function removeSpaces(string: string): string {
  return string.replace(/ /g, '')
}

function sanitizePhoneNumber(prefix: string, phone: string): string {
  const noSpaces = removeSpaces(phone)
  const re = new RegExp(`^\\+${prefix}`)
  return noSpaces.replace(re, '')
}

const createUser = (user: InitializeUser): InitializeUser => {
  return {
    email: user.email,
    teamName: user.teamName,
    phoneNumber: sanitizePhoneNumber('65', user.phoneNumber),
    role: user.role || "participant"
  }
}

export const getCsvHeadersFromString = (string: string): string[] => {
  const result: string[][] = parse(string, {
    delimiter: ',',
    trim: true,
    to: 2,
  })
  return result[0]
}

export const getUsersFromCsv = (userListCsv: string): InitializeUser[] => {
  const parsedCsv: InitializeUser[] = parse(userListCsv, {
    delimiter: ',',
    trim: true,
    columns: true,
  })
  return parsedCsv.map((user) => createUser(user))
}
