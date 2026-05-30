'use client'
import { useApp } from '../../components/AppStateProvider'
import { useShows } from '../../hooks/useShows'

export default function SubscriptionsPage() {
  const { toggleSubscribe } = useApp()
  const { subscriptions, unplayedCount } = useShows()

  return (
    <section data-testid="page-subscriptions">
      <h1>Subscriptions</h1>
      <p data-testid="unplayed-count">{unplayedCount}</p>
      {subscriptions.length === 0 ? (
        <p data-testid="subs-empty">No subscriptions yet.</p>
      ) : (
        <ul data-testid="subs-list">
          {subscriptions.map((s) => (
            <li key={s.id} data-testid={`sub-${s.id}`}>
              <span data-testid={`sub-${s.id}-title`}>{s.title}</span>
              <button data-testid={`unsub-${s.id}`} onClick={() => toggleSubscribe(s.id)}>
                Unsubscribe
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
