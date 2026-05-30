'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { useTrades } from '../../hooks/useTrades'

export default function DetailPage() {
  const { items, selectedId, propose, accept, decline } = useApp()
  const { offersForItem } = useTrades()
  const [give, setGive] = useState('')
  const [error, setError] = useState(false)
  const item = items.find((i) => i.id === selectedId)

  if (!item) {
    return (
      <section data-testid="page-detail">
        <p data-testid="no-selection">No item selected.</p>
      </section>
    )
  }

  const offers = offersForItem(item.id)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const ok = propose(item.id, give)
    if (!ok) {
      setError(true)
      return
    }
    setError(false)
    setGive('')
  }

  return (
    <section data-testid="page-detail">
      <h1 data-testid="detail-name">{item.name}</h1>
      <p data-testid="detail-owner">{item.owner}</p>
      {offers.length === 0 ? (
        <p data-testid="no-offers">No offers yet.</p>
      ) : (
        <ul data-testid="offer-list">
          {offers.map((o) => (
            <li key={o.id} data-testid={`offer-${o.id}`} data-status={o.status}>
              <span data-testid={`offer-${o.id}-give`}>{o.give}</span>
              {o.status === 'pending' ? (
                <>
                  <button data-testid={`accept-${o.id}`} onClick={() => accept(o.id)}>
                    Accept
                  </button>
                  <button data-testid={`decline-${o.id}`} onClick={() => decline(o.id)}>
                    Decline
                  </button>
                </>
              ) : null}
            </li>
          ))}
        </ul>
      )}
      <form data-testid="propose-form" onSubmit={onSubmit}>
        <label htmlFor="give">What you offer</label>
        <input
          id="give"
          data-testid="give-input"
          value={give}
          onChange={(e) => setGive(e.target.value)}
        />
        {error ? <p data-testid="form-error">Describe what you would give.</p> : null}
        <button type="submit" data-testid="submit-offer">
          Propose swap
        </button>
      </form>
    </section>
  )
}
