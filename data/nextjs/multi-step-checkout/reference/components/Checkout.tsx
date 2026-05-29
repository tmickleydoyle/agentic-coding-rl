'use client'
import { useState } from 'react'

type Page = 'cart' | 'shipping' | 'confirm' | 'done'

export default function Checkout() {
  const [page, setPage] = useState<Page>('cart')
  const [total, setTotal] = useState(0)
  const [address, setAddress] = useState('')

  if (page === 'done') return <p data-testid="done">Order placed</p>

  if (page === 'cart') {
    return (
      <div>
        <h1 data-testid="page-title">Cart</h1>
        <span data-testid="total">${total}</span>
        <button data-testid="add" onClick={() => setTotal((t) => t + 5)}>Add $5</button>
        <button
          data-testid="next"
          disabled={total === 0}
          onClick={() => setPage('shipping')}
        >
          Continue
        </button>
      </div>
    )
  }

  if (page === 'shipping') {
    return (
      <div>
        <h1 data-testid="page-title">Shipping</h1>
        <input
          data-testid="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button data-testid="back" onClick={() => setPage('cart')}>Back</button>
        <button
          data-testid="next"
          disabled={address.trim() === ''}
          onClick={() => setPage('confirm')}
        >
          Continue
        </button>
      </div>
    )
  }

  // page === 'confirm'
  return (
    <div>
      <h1 data-testid="page-title">Confirmation</h1>
      <p data-testid="summary">{address} · ${total}</p>
      <button data-testid="back" onClick={() => setPage('shipping')}>Back</button>
      <button data-testid="submit" onClick={() => setPage('done')}>Place order</button>
    </div>
  )
}
