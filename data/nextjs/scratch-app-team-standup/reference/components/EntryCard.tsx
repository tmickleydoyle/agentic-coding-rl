'use client'
import type { Entry } from '../lib/types'

export default function EntryCard({
  entry,
  memberName,
}: {
  entry: Entry
  memberName: string
}) {
  return (
    <li data-testid={`entry-${entry.id}`} data-has-blocker={entry.blocker ? 'true' : 'false'}>
      <span data-testid={`entry-${entry.id}-member`}>{memberName}</span>
      <span data-testid={`entry-${entry.id}-yesterday`}>{entry.yesterday}</span>
      <span data-testid={`entry-${entry.id}-today`}>{entry.today}</span>
      {entry.blocker ? (
        <span data-testid={`entry-${entry.id}-blocker`}>{entry.blocker}</span>
      ) : null}
    </li>
  )
}
