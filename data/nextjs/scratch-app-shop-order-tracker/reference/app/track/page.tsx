'use client'
import { useShop } from '../../components/AppStateProvider'
import { useOrders } from '../../hooks/useOrders'
import Timeline from '../../components/Timeline'

export default function TrackPage() {
  const { advance } = useShop()
  const { selected } = useOrders()

  if (!selected) {
    return (
      <section data-testid="page-track">
        <h1>Track</h1>
        <p data-testid="no-selection">No order selected.</p>
      </section>
    )
  }

  return (
    <section data-testid="page-track">
      <h1>Track</h1>
      <span data-testid="track-status">{selected.status}</span>
      <Timeline order={selected} />
      <button data-testid="advance" onClick={() => advance(selected.id)}>
        Advance
      </button>
    </section>
  )
}
