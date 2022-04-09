import { Match, Matches } from '../../../types/TSS'

export function createMatch(A: string, B: string): Match {
  return { A, B, winner: 'U', scoreA: 0, scoreB: 0 }
}

export const emptyMatch = createMatch('', '')

export function createEmptyMatches(n: number): Matches {
  const matches: Matches = {}
  for (let i = 0; i < n; i++) {
    matches[i] = emptyMatch
  }
  return matches
}
