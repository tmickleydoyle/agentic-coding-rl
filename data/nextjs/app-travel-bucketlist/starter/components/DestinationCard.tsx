'use client'
import type { Destination } from '../lib/types'

export default function DestinationCard(_props: {
  destination: Destination
  onOpen: (id: string) => void
  onToggle: (id: string) => void
}) {
  // TODO: <li data-testid={`dest-<id>`} data-visited=...> with name/country/continent spans
  // and toggle-<id> / open-<id> buttons.
  return <li />
}
