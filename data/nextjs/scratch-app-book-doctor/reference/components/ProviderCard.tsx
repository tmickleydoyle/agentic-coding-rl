'use client'
import type { Provider } from '../lib/types'

export default function ProviderCard({
  provider,
  openCount,
  onSelect,
}: {
  provider: Provider
  openCount: number
  onSelect: (id: string) => void
}) {
  return (
    <li data-testid={`provider-${provider.id}`}>
      <span data-testid={`provider-${provider.id}-name`}>{provider.name}</span>
      <span data-testid={`provider-${provider.id}-specialty`}>{provider.specialty}</span>
      <span data-testid={`provider-${provider.id}-open`}>{openCount}</span>
      <button data-testid={`select-${provider.id}`} onClick={() => onSelect(provider.id)}>
        Select
      </button>
    </li>
  )
}
