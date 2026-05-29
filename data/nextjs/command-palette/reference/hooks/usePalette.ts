import { useMemo, useState } from 'react'
import type { Command } from '../components/types'

export function usePalette(commands: Command[]) {
  const [query, setQueryState] = useState('')
  const [highlight, setHighlight] = useState(0)

  const setQuery = (value: string) => {
    setQueryState(value)
    setHighlight(0)
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter((c) => c.label.toLowerCase().includes(q))
  }, [commands, query])

  const groups = useMemo(() => {
    const out: { category: string; commands: Command[] }[] = []
    const byCat = new Map<string, { category: string; commands: Command[] }>()
    for (const c of results) {
      let g = byCat.get(c.category)
      if (!g) {
        g = { category: c.category, commands: [] }
        byCat.set(c.category, g)
        out.push(g)
      }
      g.commands.push(c)
    }
    return out
  }, [results])

  const moveDown = () => {
    if (results.length === 0) return
    setHighlight((h) => (h + 1) % results.length)
  }
  const moveUp = () => {
    if (results.length === 0) return
    setHighlight((h) => (h - 1 + results.length) % results.length)
  }

  const run = () => {
    if (results.length === 0) return
    results[highlight].run()
  }

  return { query, setQuery, results, groups, highlight, moveUp, moveDown, run }
}
