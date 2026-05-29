'use client'
import type { Command } from './types'
import { usePalette } from '../hooks/usePalette'
import CommandItem from './CommandItem'

// TODO: <input data-testid="palette-input"> bound to query; ArrowDown->moveDown, ArrowUp->moveUp
// (preventDefault both), Enter->run, Escape->setQuery(''). For each group render
// <div data-testid={`group-${category}`}> with <div data-testid={`group-header-${category}`}>
// and a <CommandItem> per command (active when its flat index === highlight; onRun = c.run).
// When results is empty render <div data-testid="empty">No commands</div>.
export default function CommandPalette({ commands }: { commands: Command[] }) {
  const { query } = usePalette(commands)
  return (
    <div>
      <input data-testid="palette-input" value={query} onChange={() => {}} />
    </div>
  )
}
