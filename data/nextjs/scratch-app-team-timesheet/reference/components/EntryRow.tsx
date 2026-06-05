'use client'
import type { Entry } from '../lib/types'

export default function EntryRow({
  entry,
  projectName,
}: {
  entry: Entry
  projectName: string
}) {
  return (
    <li data-testid={`entry-${entry.id}`} data-submitted={entry.submitted ? 'true' : 'false'}>
      <span data-testid={`entry-${entry.id}-project`}>{projectName}</span>
      <span data-testid={`entry-${entry.id}-hours`}>{entry.hours}</span>
    </li>
  )
}
