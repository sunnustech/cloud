export class UniquenessChecker<T extends string | number | symbol> {
  database: Partial<Record<T, boolean>>
  constructor() {
    this.database = {}
  }
  get(key: T, defaultValue: T) {
    return key in this.database ? this.database[key] : defaultValue
  }
  exists(key: T): boolean {
    return key in this.database
  }
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
