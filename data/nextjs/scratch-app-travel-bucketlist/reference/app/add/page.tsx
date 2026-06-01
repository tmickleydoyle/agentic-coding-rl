'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'

export default function AddDestinationPage() {
  const { addDestination, navigate } = useApp()
  const [name, setName] = useState('')
  const [country, setCountry] = useState('')
  const [continent, setContinent] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim().length === 0) {
      setError('Name is required')
      return
    }
    if (continent.trim().length === 0) {
      setError('Continent is required')
      return
    }
    setError('')
    addDestination({
      name: name.trim(),
      country: country.trim(),
      continent: continent.trim(),
      notes: notes.trim(),
    })
    setName('')
    setCountry('')
    setContinent('')
    setNotes('')
    navigate('list')
  }

  return (
    <section data-testid="page-add">
      <h1>Add destination</h1>
      <form data-testid="add-form" onSubmit={onSubmit}>
        <label htmlFor="name">Name</label>
        <input id="name" data-testid="name-input" value={name} onChange={(e) => setName(e.target.value)} />

        <label htmlFor="country">Country</label>
        <input id="country" data-testid="country-input" value={country} onChange={(e) => setCountry(e.target.value)} />

        <label htmlFor="continent">Continent</label>
        <input id="continent" data-testid="continent-input" value={continent} onChange={(e) => setContinent(e.target.value)} />

        <label htmlFor="notes">Notes</label>
        <input id="notes" data-testid="notes-input" value={notes} onChange={(e) => setNotes(e.target.value)} />

        {error ? <p data-testid="form-error">{error}</p> : null}

        <button type="submit" data-testid="submit-destination">
          Add destination
        </button>
      </form>
    </section>
  )
}
