import { Match, Matches } from '../../../types/TSS'

/**
 * @param {string} A: the first team name
 * @param {string} B: the second team name
 * @return {Match} a match event with empty content
 */
export function createMatch(A: string, B: string): Match {
  return { A, B, winner: 'U', scoreA: 0, scoreB: 0 }
}

export const emptyMatch = createMatch('', '')

/**
 * @param {number} n: the number of empty matches to make
 * @return {Matches} an object with keys as match numbers
 * and values of match events
 */
export function createEmptyMatches(n: number): Matches {
  const matches: Matches = {}
  for (let i = 0; i < n; i++) {
    matches[i] = emptyMatch
  }
  return matches
}
