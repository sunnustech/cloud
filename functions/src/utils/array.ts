/**
 * Checks if two arrays have the exact same elements, does not check for order
 *
 * @param {T[]} a first array
 * @param {T[]} b second array to check again
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
 * Checks if an array is a subset of another
 *
 * @param {T[]} a first array, checks if it is a subset of the second array
 * @param {T[]} b second array
 * @return {boolean} whether or not a is a subset of b
 */
export function isSubset<T>(a: T[], b: T[]): boolean {
  return a.every((val) => b.includes(val))
}

/**
 * Filters by a condition being passed in and returns two arrays
 * The first returned array contains elements that satisfy the condition, and the second consists of the rest
 *
 * @param {T[]} array the array to split in two
 * @param {function} check the same as filter callback
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
