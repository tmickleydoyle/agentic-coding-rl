'use client'
import type { Entry } from '../lib/types'

export default function EntryRow({
  entry,
  projectName,
}: {
  entry: Entry
  projectName: string
}) {
  // TODO: render <li data-testid="entry-<id>" data-submitted> with the project name and
  // hours.
  void projectName
  return <li data-testid={`entry-${entry.id}`} />
}
