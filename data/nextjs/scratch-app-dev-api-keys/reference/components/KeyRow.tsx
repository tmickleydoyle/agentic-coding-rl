'use client'
import type { ApiKey } from '../lib/types'
import { maskSecret } from '../lib/mask'

export default function KeyRow({
  apiKey,
  onView,
}: {
  apiKey: ApiKey
  onView: (id: string) => void
}) {
  return (
    <li data-testid={`key-${apiKey.id}`} data-active={apiKey.active ? 'true' : 'false'}>
      <span data-testid={`key-${apiKey.id}-name`}>{apiKey.name}</span>
      <span data-testid={`key-${apiKey.id}-secret`}>{maskSecret(apiKey.secret)}</span>
      <button data-testid={`view-${apiKey.id}`} onClick={() => onView(apiKey.id)}>
        View
      </button>
    </li>
  )
}
