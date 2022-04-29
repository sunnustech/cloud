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

/**
 * required that a <= b, else exit firebase with message
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
  const ok = a.every((val) => b.includes(val))
  if (!ok) {
    res.json({ message, missingElements: a.filter((x) => !b.includes(x)) })
    return false
  }
  return true
}
