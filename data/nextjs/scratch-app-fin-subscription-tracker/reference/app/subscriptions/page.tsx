'use client'
import { useState } from 'react'
import { useSubs } from '../../components/SubsProvider'
import SubItem from '../../components/SubItem'

export default function SubscriptionsPage() {
  const { subscriptions, cancelSubscription } = useSubs()
  const [showActiveOnly, setShowActiveOnly] = useState(false)

  const visible = showActiveOnly ? subscriptions.filter((s) => s.active) : subscriptions

  return (
    <section data-testid="page-subscriptions">
      <h1>Subscriptions</h1>
      <label htmlFor="active-only">Active only</label>
      <input
        id="active-only"
        type="checkbox"
        data-testid="active-only"
        checked={showActiveOnly}
        onChange={(e) => setShowActiveOnly(e.target.checked)}
      />
      {visible.length === 0 ? (
        <p data-testid="empty-subscriptions">No subscriptions.</p>
      ) : (
        <ul data-testid="sub-list">
          {visible.map((s) => (
            <SubItem key={s.id} sub={s} onCancel={cancelSubscription} />
          ))}
        </ul>
      )}
    </section>
  )
}
