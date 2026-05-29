'use client'
import type { Command } from './types'

export default function CommandItem({
  command,
  active,
  onRun,
}: {
  command: Command
  active: boolean
  onRun: () => void
}) {
  return (
    <button
      data-testid={`cmd-${command.id}`}
      aria-selected={active}
      onClick={onRun}
    >
      {command.label}
    </button>
  )
}
