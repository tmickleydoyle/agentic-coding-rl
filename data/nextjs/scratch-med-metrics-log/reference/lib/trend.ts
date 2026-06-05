import type { Entry } from './types'

export function getTrend(entries: Entry[], currentIdx: number): string {
  const current = entries[currentIdx]
  // Find the immediately preceding entry with the same name
  let prev: Entry | null = null
  for (let i = currentIdx - 1; i >= 0; i--) {
    if (entries[i].name === current.name) {
      prev = entries[i]
      break
    }
  }
  if (prev === null) return ''
  if (current.value > prev.value) return '\u25b2'
  if (current.value < prev.value) return '\u25bc'
  return '\u2014'
}
