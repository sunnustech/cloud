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
