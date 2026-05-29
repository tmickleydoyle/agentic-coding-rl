'use client'
import type { Command } from './types'

// TODO: render <button data-testid={`cmd-${command.id}`}> with the label,
// aria-selected={active}, calling onRun on click.
export default function CommandItem({
  command,
  active,
  onRun,
}: {
  command: Command
  active: boolean
  onRun: () => void
}) {
  return <button data-testid={`cmd-${command.id}`}>{command.label}</button>
}
