export const base = 'http://localhost:5001/sunnus-22/us-central1'

export function cloud(string: string): string {
  return `${base}/${string}`
}
