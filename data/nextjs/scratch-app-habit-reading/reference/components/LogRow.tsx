'use client'
import type { ReadLog } from '../lib/types'

export default function LogRow({
  log,
  onRemove,
}: {
  log: ReadLog
  onRemove: (id: string) => void
}) {
  return (
    <li data-testid={`log-${log.id}`}>
      <span data-testid={`log-${log.id}-date`}>{log.date}</span>
      <span data-testid={`log-${log.id}-pages`}>{log.pages}</span>
      <button data-testid={`remove-${log.id}`} onClick={() => onRemove(log.id)}>
        Delete
      </button>
    </li>
  )
}
