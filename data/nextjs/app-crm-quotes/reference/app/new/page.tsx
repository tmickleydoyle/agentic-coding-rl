'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'

function toNumber(value: string): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

export default function NewQuotePage() {
  const { addQuote, selectQuote, navigate } = useApp()
  const [client, setClient] = useState('')
  const [desc, setDesc] = useState('')
  const [qty, setQty] = useState('')
  const [price, setPrice] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (client.trim().length === 0) {
      setError('Client is required')
      return
    }
    setError('')
    const items = [
      { description: desc.trim(), qty: toNumber(qty), price: toNumber(price) },
    ]
    const id = addQuote({ client: client.trim(), items })
    selectQuote(id)
    setClient('')
    setDesc('')
    setQty('')
    setPrice('')
    navigate('quote-detail')
  }

  return (
    <section data-testid="page-new">
      <h1>New quote</h1>
      <form data-testid="new-quote-form" onSubmit={onSubmit}>
        <label htmlFor="client">Client</label>
        <input
          id="client"
          data-testid="client-input"
          value={client}
          onChange={(e) => setClient(e.target.value)}
        />

        <label htmlFor="desc">Description</label>
        <input
          id="desc"
          data-testid="desc-input"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        <label htmlFor="qty">Qty</label>
        <input
          id="qty"
          type="number"
          data-testid="qty-input"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />

        <label htmlFor="price">Price</label>
        <input
          id="price"
          type="number"
          data-testid="price-input"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        {error ? <p data-testid="form-error">{error}</p> : null}

        <button type="submit" data-testid="submit-quote">
          Add quote
        </button>
      </form>
    </section>
  )
}
