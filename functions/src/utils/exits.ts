import { Request } from 'firebase-functions'
import { Response } from 'express'

type RequiredKey = {
  key: string
  description: string
}

/**
 * Requires that all keys are in, else exit firebase with message
 *
 * @param {RequiredKey[]} arr array of key-message pairs
 * @param {Request} req the entire request body
 * @param {Response<any>} res
 * @return {boolean} whether or not all keys are in
 */
export const hasMissingKeys = (
  arr: RequiredKey[],
  req: Request,
  res: Response<any>
): boolean => {
  function getMessage(item: RequiredKey): string {
    const vowel = ['a', 'e', 'i', 'o', 'u']
    const an = vowel.includes(item.key[0]) ? 'an' : 'a'
    return `Please supply ${an} ${item.description} in the \`${item.key}\` prop of the request body.`
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

/**
 * Requires that all keys are in, else exit firebase with message
 *
 * @param {RequiredKey[]} arr: array of key-message pairs
 * @param {any} data
 * @return {string}
 */
export const _hasMissingKeys = (
  arr: RequiredKey[],
  data: any
): string => {
  function getMessage(item: RequiredKey): string {
    const vowel = ['a', 'e', 'i', 'o', 'u']
    const an = vowel.includes(item.key[0]) ? 'an' : 'a'
    return `Please supply ${an} ${item.description} in the \`${item.key}\` prop of the request body.`
  }
  const requestedKeys = Object.keys(data)
  for (let i = 0; i < arr.length; i++) {
    const pair = arr[i]
    if (!requestedKeys.includes(pair.key)) {
      return getMessage(pair)
    }
  }
  return 'all ok'
}

/**
 * Compares two arraysm and checks if the first array is part of the second one
 *
 * @param {T[]} a first array which is required to be in the second array
 * @param {T[]} b second array
 * @param {string} message
 * @param {Response<any>} res
 * @return {boolean} whether or not first array is a subset of the second
 */
export function isSubset<T>(
  a: T[],
  b: T[],
  message: string,
  res: Response<any>
): boolean {
  if (b.length === 0) {
    res.json({ message: 'list has no elements' })
    return false
  }
  const ok = a.every((val) => b.includes(val))
  if (!ok) {
    res.json({ message, missingElements: a.filter((x) => !b.includes(x)) })
    return false
  }
  return true
}

/**
 * Checks if input is empty
 *
 * @param {string} string input to be checked
 * @param {Response<any>} res
 * @return {boolean} whether or not input is empty
 */
export function isEmpty(string: string, res: Response<any>): boolean {
  if (string === '') {
    res.json({ message: 'Error: expected non-empty string' })
    return true
  }
  return false
}
