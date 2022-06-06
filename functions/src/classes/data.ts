/**
 * creates a Set of unique values that you can push to
 */
export class UniquenessChecker<T extends string | number | symbol> {
  database: Partial<Record<T, boolean>>

  /** instantiate the uniqueness checker */
  constructor() {
    this.database = {}
  }

  /**
   * checks if the key is already seen
   * @param {T} key
   * @return {boolean}
   */
  exists(key: T): boolean {
    return key in this.database
  }

  /**
   * add new key to seen list
   * @param {T} key
   * @return {boolean}
   */
  push(key: T): boolean {
    if (key === undefined) {
      return false
    }
    if (!(key in this.database)) {
      this.database[key] = true
      return true
    }
    return false
  }
}
