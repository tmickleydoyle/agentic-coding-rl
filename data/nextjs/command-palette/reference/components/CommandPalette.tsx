'use client'
import type { KeyboardEvent } from 'react'
import type { Command } from './types'
import { usePalette } from '../hooks/usePalette'
import CommandItem from './CommandItem'

export default function CommandPalette({ commands }: { commands: Command[] }) {
  const { query, setQuery, results, groups, highlight, moveUp, moveDown, run } =
    usePalette(commands)

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      moveDown()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      moveUp()
    } else if (e.key === 'Enter') {
      run()
    } else if (e.key === 'Escape') {
      setQuery('')
    }
  }

  // Map each command to its flat index in `results` so we can mark the active one.
  const flatIndex = new Map<string, number>()
  results.forEach((c, i) => flatIndex.set(c.id, i))

  return (
    <div>
      <input
        data-testid="palette-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onKeyDown}
      />
      {results.length === 0 ? (
        <div data-testid="empty">No commands</div>
      ) : (
        groups.map((g) => (
          <div key={g.category} data-testid={`group-${g.category}`}>
            <div data-testid={`group-header-${g.category}`}>{g.category}</div>
            {g.commands.map((c) => (
              <CommandItem
                key={c.id}
                command={c}
                active={flatIndex.get(c.id) === highlight}
                onRun={c.run}
              />
            ))}
          </div>
        ))
      )}
    </div>
  )
}
