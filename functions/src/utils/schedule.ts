/**
 * Converts a given string in the specified format to a date object
 * 
 * @param {string} HHMM time in HH:MM format
 * @return {Date} a javascript date object
 */
export function dateify(HHMM: string): Date {
  const [h, m] = HHMM.split(':').map((e) => parseInt(e))
  return new Date(0, 0, 0, h, m)
}

/**
 * Checks if a date is in between the specified time period
 * 
 * @param {Date} c the date to check
 * @param {Date} a the early bound
 * @param {Date} b the late bound
 * @return {boolean} whether or not a < c < b
 */
export function inBetween(c: Date, a: Date, b: Date): boolean {
  const [C, A, B] = [c, a, b].map((e: Date) => e.getTime())
  return A <= C && C < B
}

/**
 * Converts a number into its position in the alphabet
 * A -> 1, B -> 2, ... , Z -> 26
 * 
 * @param {number} n: the number
 * @return {string} the letter, '_' if number is invalid
 */
export function letter(n: number): string {
  if (n < 0 || n > 25) {
    return '_'
  }
  return (n + 10).toString(36).toUpperCase()
}

/**
 * Gets the time in a string format from a given Date object
 * 
 * @param {Date} t: the Date object
 * @return {string} time in HH:MM format
 */
export function time(t: Date): string {
  return t.toLocaleTimeString('en-sg', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

/**
 * Initializes start and end time
 * 
 * @param {Date} first: the start time of the first match
 * @param {number} matchLength
 * @return {Date[]} [start, end]
 */
export function startEndInit(first: Date, matchLength: number): Date[] {
  const s = new Date(first)
  const e = new Date(first)
  e.setMinutes(s.getMinutes() + matchLength)
  return [s, e]
}

/**
 * Increments time by a given interval
 * 
 * @param {Date} s: start of match
 * @param {Date} e: end of match
 * @param {number} interval: end of match
 */
export function incrementTime(s: Date, e: Date, interval: number): void {
  s.setMinutes(s.getMinutes() + interval)
  e.setMinutes(e.getMinutes() + interval)
}
