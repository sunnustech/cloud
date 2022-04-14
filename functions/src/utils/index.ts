// import { firestore } from 'firebase-admin'
import { Team } from '../types/sunnus-firestore'
import { CollectionReference, DocumentData } from '@google-cloud/firestore'
import { Request } from 'firebase-functions'

type Collection = CollectionReference<DocumentData>

/**
 * @param {string} string: the string you want to process
 * @return {string} the joined string with each first letter capitalized
 */
export function capitalizeFirstLettersAndJoin(string: string): string {
  const separateWord = string.split(' ')
  for (let i = 0; i < separateWord.length; i++) {
    separateWord[i] =
      separateWord[i].charAt(0).toUpperCase() + separateWord[i].substring(1)
  }
  return separateWord.join('')
}

/**
 * creates an object with team names as keys
 * and team props as values
 * @param {Array<T>} arr: the array of team props
 * @return {Record<string, T>} the final object
 */
export function makeTeams(arr: Array<Team>): Record<string, Team> {
  const obj: Record<string, Team> = {}
  arr.forEach((e: Team) => {
    obj[e.teamName] = e
  })
  return obj
}

/**
 * retrives a list of document ids of a collection
 * @param {Collection} collection: the collection reference
 * @return {Promise<string[]>} the list
 */
export async function listDocIdsAsync(
    collection: Collection
): Promise<string[]> {
  const list: string[] = (await collection.listDocuments()).map((e) => e.id)
  return list
}

/**
 * filter, but two ways
 * @param {T[]} array: the array to split in two
 * @param {function} check: the same as filter callback
 * @return {[T[], T[]]} the pass-fail array
 */
export function partition<T>(
    array: T[],
    check: (elem: T) => boolean
): [T[], T[]] {
  return array.reduce(
      (result: [pass: T[], fail: T[]], element) => {
        result[check(element) ? 0 : 1].push(element)
        return result
      },
      [[], []]
  )
}

/**
 * tries for a random login id (6-digit numeric string)
 * @return {string} the login id
 */
function makeLoginId(): string {
  const [min, max] = [0, 1000000]
  const random = Math.random() * (max - min)
  const integer = Math.floor(random) + min + max
  return integer.toString().substring(1)
}

/**
 * generates a list of login ids that do not exist yet
 * @param {number} n: number of unique ids to generate
 * @param {string[]} existingIds: list of existing ids
 * @return {string[]} list of new unique ids
 */
export function makeLoginIdList(n: number, existingIds: string[]): string[] {
  const existingIdDict: Record<string, boolean> = {}
  existingIds.forEach((id) => {
    existingIdDict[id] = true
  })
  const fresh: string[] = []
  let i = 0
  while (i < n) {
    const id = makeLoginId()
    if (existingIdDict[id] === true) {
      continue
    }
    fresh.push(id)
    existingIdDict[id] = true
    i++
  }
  return fresh
}

/**
 * for every request/onCall, check if there are missing keys
 * @param {string[][]} arr: array of key-message pairs
 * @param {Request} req: the entire request body
 * @returns {string[]} message and status
 */
export const hasMissingKeys = (
    arr: string[][],
    req: Request
): [message: string, status: 'missing' | 'has-all'] => {
  const requestKeys = Object.keys(req.body)
  const required = arr.map((pair) => pair[0])
  for (let i = 0; i < required.length; i++) {
    const key = required[i]
    if (!requestKeys.includes(key)) {
      return [arr[i][1], 'missing']
    }
  }
  return ['', 'has-all']
}

import { deleteDocs } from './deleteDocs'
import { clearCollection } from './clearCollection'
export { deleteDocs, clearCollection }
