'use client'
import { useApp } from '../../components/AppStateProvider'
import { useSubscriptions } from '../../hooks/useChannel'

export default function SubscriptionsPage() {
  const { toggleSubscribe } = useApp()
  const subs = useSubscriptions()

  if (subs.length === 0) {
    return (
      <section data-testid="page-subscriptions">
        <p data-testid="no-subscriptions">No subscriptions yet.</p>
      </section>
    )
  }

  return (
    <section data-testid="page-subscriptions">
      <h1>Subscriptions</h1>
      <span data-testid="subscribed-count-value">{subs.length}</span>
      <ul data-testid="subscriptions-list">
        {subs.map((c) => (
          <li key={c.id} data-testid={`sub-${c.id}`}>
            <span data-testid={`sub-${c.id}-name`}>{c.name}</span>
            <button data-testid={`unsub-${c.id}`} onClick={() => toggleSubscribe(c.id)}>
              Unsubscribe
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
