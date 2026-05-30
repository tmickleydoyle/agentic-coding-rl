'use client'
import { useState } from 'react'
import { useOrdersState } from '../../components/AppStateProvider'

export default function NewPage() {
  const { addOrder } = useOrdersState()
  const [supplier, setSupplier] = useState('')
  const [item, setItem] = useState('')
  const [ordered, setOrdered] = useState('')
  const [error, setError] = useState('')

  const submit = () => {
    const qty = Number(ordered)
    if (supplier.trim().length === 0 || item.trim().length === 0) {
      setError('Supplier and item are required.')
      return
    }
    if (!Number.isFinite(qty) || qty <= 0) {
      setError('Ordered quantity must be positive.')
      return
    }
    setError('')
    addOrder({ supplier: supplier.trim(), item: item.trim(), ordered: Math.trunc(qty) })
  }

  return (
    <section data-testid="page-new">
      <h1>New order</h1>
      <input
        data-testid="supplier-input"
        placeholder="Supplier"
        value={supplier}
        onChange={(e) => setSupplier(e.target.value)}
      />
      <input
        data-testid="item-input"
        placeholder="Item"
        value={item}
        onChange={(e) => setItem(e.target.value)}
      />
      <input
        data-testid="ordered-input"
        placeholder="Ordered"
        value={ordered}
        onChange={(e) => setOrdered(e.target.value)}
      />
      {error ? <p data-testid="form-error">{error}</p> : null}
      <button data-testid="create-order" onClick={submit}>
        Create order
      </button>
    </section>
  )
}
