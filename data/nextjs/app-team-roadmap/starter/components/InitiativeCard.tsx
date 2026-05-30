'use client'
import type { Initiative } from '../lib/types'

export default function InitiativeCard({
  initiative,
  onOpen,
}: {
  initiative: Initiative
  onOpen: (id: string) => void
}) {
  // TODO: render <li data-testid="card-<id>" data-status> with the title and an open-<id>
  // button.
  void onOpen
  return <li data-testid={`card-${initiative.id}`} />
}
