'use client'
import { useState } from 'react'
import { useShopping } from '../../components/AppStateProvider'

export default function AddPage() {
  const { addItem, navigate } = useShopping()
  const [name, setName] = useState('')
  const [aisle, setAisle] = useState('')
  const [qty, setQty] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim().length === 0) {
      setError('Name is required')
      return
    }
    setError('')
    const parsedQty = Number(qty)
    addItem({
      name: name.trim(),
      aisle: aisle.trim().length > 0 ? aisle.trim() : 'Other',
      qty: Number.isFinite(parsedQty) && parsedQty > 0 ? parsedQty : 1,
    })
    setName('')
    setAisle('')
    setQty('')
    navigate('list')
  }

  return (
    <section data-testid="page-add">
      <h1>Add item</h1>
      <form data-testid="add-item-form" onSubmit={onSubmit}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          data-testid="name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="aisle">Aisle</label>
        <input
          id="aisle"
          data-testid="aisle-input"
          value={aisle}
          onChange={(e) => setAisle(e.target.value)}
        />

        <label htmlFor="qty">Quantity</label>
        <input
          id="qty"
          type="number"
          data-testid="qty-input"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />

        {error ? <p data-testid="form-error">{error}</p> : null}

        <button type="submit" data-testid="submit-item">
          Add item
        </button>
      </form>
    </section>
  )
}
