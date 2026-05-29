import { useState } from 'react'
import type { Command } from '../components/types'

// TODO: return { query, setQuery, results, groups, highlight, moveUp, moveDown, run }.
// setQuery updates query and resets highlight to 0. results = case-insensitive label substring
// matches (empty keeps all), input order. groups = results grouped by category in first-seen order.
// highlight indexes the flat results list; moveUp/moveDown wrap mod results.length (no-op if empty).
// run() calls results[highlight].run() when results is non-empty.
export function usePalette(commands: Command[]) {
  const [query, setQuery] = useState('')
  const [highlight, setHighlight] = useState(0)
  return {
    query,
    setQuery: (_value: string) => {},
    results: [] as Command[],
    groups: [] as { category: string; commands: Command[] }[],
    highlight,
    moveUp: () => {},
    moveDown: () => {},
    run: () => {},
  }
}
