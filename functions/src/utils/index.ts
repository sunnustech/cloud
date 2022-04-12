import { TeamProps } from '../types/participants'
import { firestore } from 'firebase-admin'

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
export function makeTeams(arr: Array<TeamProps>): Record<string, TeamProps> {
  const obj: Record<string, TeamProps> = {}
  arr.forEach((e: TeamProps) => {
    obj[e.teamName] = e
  })
  return obj
}

/**
 * retrives a list of document ids of a collection
 * @param {string} collection: the name of the collection to read
 * @return {Promise<string[]>} the list
 */
export async function listDocIdsAsync(collection: string): Promise<string[]> {
  const list: string[] = (
    await firestore().collection(collection).listDocuments()
  ).map((e) => e.id)
  return list
}

/**
 * filter, but two ways
 * @param {T[]} array: the array to split in two
 * @return {[T[], T[]]} the pass-fail array
 */
export function partition<T>(array: T[], check: (elem: T) => boolean): [T[], T[]] {
  return array.reduce(
    (result: [pass: T[], fail: T[]], element) => {
      result[check(element) ? 0 : 1].push(element)
      return result
    },
    [[], []]
  )
}
