'use client'
import { useApp } from '../../components/AppStateProvider'
import { maskSecret } from '../../lib/mask'

export default function KeyDetailPage() {
  const { keys, selectedKeyId, revokeKey, recordUsage } = useApp()

  if (!selectedKeyId) {
    return (
      <section data-testid="page-key-detail">
        <p data-testid="no-selection">No key selected.</p>
      </section>
    )
  }

  const apiKey = keys.find((k) => k.id === selectedKeyId)
  if (!apiKey) {
    return (
      <section data-testid="page-key-detail">
        <p data-testid="no-selection">No key selected.</p>
      </section>
    )
  }

  return (
    <section data-testid="page-key-detail">
      <h1 data-testid="detail-name">{apiKey.name}</h1>
      <p data-testid="detail-secret">{maskSecret(apiKey.secret)}</p>
      <ul data-testid="detail-scopes">
        {apiKey.scopes.map((s) => (
          <li key={s} data-testid={`scope-${s}`}>
            {s}
          </li>
        ))}
      </ul>
      <p data-testid="detail-usage">{apiKey.usageCount}</p>
      <p data-testid="detail-status">{apiKey.active ? 'active' : 'revoked'}</p>
      {apiKey.active ? (
        <button data-testid="revoke-btn" onClick={() => revokeKey(apiKey.id)}>
          Revoke
        </button>
      ) : null}
      <button data-testid="use-btn" onClick={() => recordUsage(apiKey.id)}>
        Record usage
      </button>
    </section>
  )
}
