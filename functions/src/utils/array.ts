/**
 * check if two arrays have the exact same elements
 * doesn't check order
 * @param {T[]} a
 * @param {T[]} b
 * @return {boolean} whether or not they have the same elements
 */
export function sameElements<T>(a: T[], b: T[]): boolean {
  if (a.length === b.length) {
    return a.every((element) => {
      if (b.includes(element)) {
        return true
      }
      return false
    })
  }
  return false
}

/**
 * check if a is a subset of b
 * @param {T[]} a
 * @param {T[]} b
 * @return {boolean}
 */
export function isSubset<T>(a: T[], b: T[]): boolean {
  return a.every((val) => b.includes(val))
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

