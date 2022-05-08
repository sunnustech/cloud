import { Request } from 'firebase-functions'
import { Response } from 'express'

type RequiredKey = {
  key: string
  description: string
}

/**
 * requires that all keys are in, else exit firebase with message
 * @param {RequiredKey[]} arr: array of key-message pairs
 * @param {Request} req: the entire request body
 * @param {Response<any>} res
 * @return {boolean}
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
 * required that a <= b, else exit firebase with message
 * where a is the required list
 * @param {T[]} a
 * @param {T[]} b
 * @param {string} message
 * @param {Response<any>} res
 * @return {boolean}
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
 * required that input is not blank, else exist
 * where a is the required list
 * @param {string} string
 * @param {Response<any>} res
 * @return {boolean}
 */
export function isEmpty(
  string: string,
  res: Response<any>
): boolean {
  if (string === '') {
    res.json({ message: 'Error: expected non-empty string' })
    return true
  }
  return false
}
