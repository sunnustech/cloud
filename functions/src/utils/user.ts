import { getAllExistingValues } from './firestore'

/**
 * Generates a random number x within a specified range
 *
 * @param {number} min floor of generated number
 * @param {number} max ceiling of generated number
 * @return {number} a random number
 */
function randInt(min: number, max: number): number {
  const random = Math.random() * (max - min)
  return Math.floor(random) + min
}

/**
 * Generates a random login id (n-digit numeric string)
 *
 * @param {number} n length of login id
 * @return {string} the login id
 */
function makeLoginId(n: number): string {
  const t = 10 ** n
  const integer = randInt(0, t) + t
  return integer.toString().substring(1)
}

/**
 * Generates a list of login ids that do not exist yet
 *
 * @param {number} n number of unique ids to generate
 * @return {string[]} list of new unique ids
 */
export async function getFreshLoginIds(n: number): Promise<string[]> {
  /* get list of all existing loginIds */
  const already = await getAllExistingValues('users', 'loginIdNumber')

  const fresh: string[] = []
  let i = 0
  while (i < n) {
    const id = makeLoginId(6)
    if (already.exists(id)) {
      continue
    }
    already.push(id)
    fresh.push(id)
    i++
  }
  return fresh
}
