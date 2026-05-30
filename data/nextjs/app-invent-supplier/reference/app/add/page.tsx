'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'

export default function AddSupplierPage() {
  const { addSupplier, navigate } = useApp()
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [leadTime, setLeadTime] = useState('')
  const [rating, setRating] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim().length === 0) {
      setError('Name is required')
      return
    }
    const lead = Number(leadTime)
    if (leadTime.trim().length === 0 || Number.isNaN(lead) || lead < 0) {
      setError('Lead time must be a non-negative number')
      return
    }
    setError('')
    addSupplier({
      name: name.trim(),
      category: category.trim().length > 0 ? category.trim() : 'Uncategorized',
      leadTimeDays: lead,
      rating: Number(rating) || 0,
    })
    setName('')
    setCategory('')
    setLeadTime('')
    setRating('')
    navigate('suppliers')
  }

  return (
    <section data-testid="page-add">
      <h1>Add supplier</h1>
      <form data-testid="add-form" onSubmit={onSubmit}>
        <label htmlFor="name">Name</label>
        <input id="name" data-testid="name-input" value={name} onChange={(e) => setName(e.target.value)} />

        <label htmlFor="category">Category</label>
        <input id="category" data-testid="category-input" value={category} onChange={(e) => setCategory(e.target.value)} />

        <label htmlFor="lead">Lead time (days)</label>
        <input id="lead" data-testid="lead-input" value={leadTime} onChange={(e) => setLeadTime(e.target.value)} />

        <label htmlFor="rating">Rating</label>
        <input id="rating" data-testid="rating-input" value={rating} onChange={(e) => setRating(e.target.value)} />

        {error ? <p data-testid="form-error">{error}</p> : null}

        <button type="submit" data-testid="submit-supplier">
          Add supplier
        </button>
      </form>
    </section>
  )
}
