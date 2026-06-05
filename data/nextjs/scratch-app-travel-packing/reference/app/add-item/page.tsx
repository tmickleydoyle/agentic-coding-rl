'use client'
import { useState } from 'react'
import { usePacking } from '../../components/PackingProvider'
import type { Category } from '../../lib/types'
import { CATEGORIES } from '../../lib/types'

export default function AddItemPage() {
  const { trips, selectedTripId, addItem, navigate } = usePacking()
  const [tripId, setTripId] = useState(selectedTripId ?? trips[0]?.id ?? '')
  const [name, setName] = useState('')
  const [category, setCategory] = useState<Category>('clothing')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim().length === 0) {
      setError('Name is required')
      return
    }
    setError('')
    addItem({ tripId, name: name.trim(), category })
    setName('')
    navigate('list')
  }

  return (
    <section data-testid="page-add-item">
      <h1>Add item</h1>
      <form data-testid="add-item-form" onSubmit={onSubmit}>
        <label htmlFor="trip">Trip</label>
        <select
          id="trip"
          data-testid="trip-select"
          value={tripId}
          onChange={(e) => setTripId(e.target.value)}
        >
          {trips.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <label htmlFor="name">Name</label>
        <input
          id="name"
          data-testid="name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="category">Category</label>
        <select
          id="category"
          data-testid="category-select"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {error ? <p data-testid="form-error">{error}</p> : null}

        <button type="submit" data-testid="submit-item">
          Add
        </button>
      </form>
    </section>
  )
}
