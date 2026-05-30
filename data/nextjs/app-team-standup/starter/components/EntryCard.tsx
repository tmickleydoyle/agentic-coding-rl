'use client'
import type { Entry } from '../lib/types'

export default function EntryCard({
  entry,
  memberName,
}: {
  entry: Entry
  memberName: string
}) {
  // TODO: render <li data-testid="entry-<id>" data-has-blocker> with member name,
  // yesterday, today, and (only when present) blocker.
  void memberName
  return <li data-testid={`entry-${entry.id}`} />
}
