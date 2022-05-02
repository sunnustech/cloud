export type ResultSummary = {
  fulfilled: number
  rejected: number
}
/**
 * @param {PromiseSettledResult<T>[]} p
 * @returns { fulfilled: number, rejected: number }
 */
export function resultSummary<T>(p: PromiseSettledResult<T>[]): ResultSummary {
  const result = { fulfilled: 0, rejected: 0 }
  p.forEach((x) => (result[x.status] += 1))
  return result
}
