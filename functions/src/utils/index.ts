// import { firestore } from 'firebase-admin'
import { CollectionReference, DocumentData } from '@google-cloud/firestore'
import { Request } from 'firebase-functions'
import { Response } from 'express'

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

type RequiredKey = {
  key: string
  description: string
}

/**
 * check for missing keys
 * @param {RequiredKey[]} arr: array of key-message pairs
 * @param {string} req: the entire request body
 * @return {string[]} the message and status
 */
export const hasMissingKeys = (
  arr: RequiredKey[],
  req: Request,
  res: Response<any>
): boolean => {
  function getMessage(item: RequiredKey): string {
    const vowel = ['a', 'e', 'i', 'o', 'u']
    const an = vowel.includes(item.key[0]) ? 'an' : 'a'
    return `Please supply ${an} ${item.key} in the \`${item.description}\` prop of the request body.`
  }
  const requestedKeys = Object.keys(req.body)
  for (let i = 0; i < arr.length; i++) {
    const pair = arr[i]
    if (!requestedKeys.includes(pair.key)) {
      res.json({ message: getMessage(pair) })
      return true
    }
  }
  return false
}
