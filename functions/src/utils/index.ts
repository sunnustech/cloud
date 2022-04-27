// import { firestore } from 'firebase-admin'
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
 * check for missing keys
 * @param {Array<string[]>} arr: array of key-message pairs
 * @param {string} req: the entire request body
 * @return {string[]} the message and status
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
