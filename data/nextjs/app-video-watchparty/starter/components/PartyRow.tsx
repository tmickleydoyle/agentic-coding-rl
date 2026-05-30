'use client'
import type { Filter, Party } from '../lib/types'

export default function PartyRow({
  party,
  status,
  onOpen,
}: {
  party: Party
  status: Filter
  onOpen: (id: string) => void
}) {
  return (
    <li data-testid={`party-${party.id}`}>
      <span data-testid={`party-${party.id}-title`}>{party.title}</span>
      <span data-testid={`party-${party.id}-status`}>{status}</span>
      <button data-testid={`open-${party.id}`} onClick={() => onOpen(party.id)}>
        Open
      </button>
    </li>
  )
}
