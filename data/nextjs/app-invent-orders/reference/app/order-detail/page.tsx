'use client'
import { useState } from 'react'
import { useOrdersState } from '../../components/AppStateProvider'
import { useOrders } from '../../hooks/useOrders'
import { orderStatus, outstanding } from '../../lib/types'

export default function OrderDetailPage() {
  const { receive, cancel } = useOrdersState()
  const { selected } = useOrders()
  const [amount, setAmount] = useState('1')

  if (!selected) {
    return (
      <section data-testid="page-order-detail">
        <h1>Order detail</h1>
        <p data-testid="no-selection">No order selected.</p>
      </section>
    )
  }

  const n = Number(amount)
  const step = Number.isFinite(n) ? Math.trunc(n) : 0

  return (
    <section data-testid="page-order-detail">
      <h1>Order detail</h1>
      <span data-testid="detail-supplier">{selected.supplier}</span>
      <span data-testid="detail-item">{selected.item}</span>
      <span data-testid="detail-ordered">{selected.ordered}</span>
      <span data-testid="detail-received">{selected.received}</span>
      <span data-testid="detail-outstanding">{outstanding(selected)}</span>
      <span data-testid="detail-status">{orderStatus(selected)}</span>
      <input
        data-testid="receive-input"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button
        data-testid="receive"
        onClick={() => receive(selected.id, Math.abs(step))}
        disabled={selected.cancelled}
      >
        Receive
      </button>
      <button
        data-testid="receive-all"
        onClick={() => receive(selected.id, outstanding(selected))}
        disabled={selected.cancelled}
      >
        Receive all
      </button>
      <button
        data-testid="cancel"
        onClick={() => cancel(selected.id)}
        disabled={selected.cancelled}
      >
        Cancel order
      </button>
    </section>
  )
}
