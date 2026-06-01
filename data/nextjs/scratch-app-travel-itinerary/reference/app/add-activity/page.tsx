'use client'
import { useState } from 'react'
import { useItinerary } from '../../components/ItineraryProvider'

export default function AddActivityPage() {
  const { trips, selectedTripId, addActivity, navigate } = useItinerary()
  const [tripId, setTripId] = useState(selectedTripId ?? trips[0]?.id ?? '')
  const [day, setDay] = useState('1')
  const [title, setTitle] = useState('')
  const [cost, setCost] = useState('0')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim().length === 0) {
      setError('Title is required')
      return
    }
    setError('')
    const dayNum = Number.parseInt(day, 10)
    const costNum = Number.parseFloat(cost)
    addActivity({
      tripId,
      day: Number.isNaN(dayNum) || dayNum < 1 ? 1 : dayNum,
      title: title.trim(),
      cost: Number.isNaN(costNum) || costNum < 0 ? 0 : costNum,
    })
    setTitle('')
    setCost('0')
    navigate('trip-detail')
  }

  return (
    <section data-testid="page-add-activity">
      <h1>Add activity</h1>
      <form data-testid="add-activity-form" onSubmit={onSubmit}>
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

        <label htmlFor="day">Day</label>
        <input
          id="day"
          type="number"
          data-testid="day-input"
          value={day}
          onChange={(e) => setDay(e.target.value)}
        />

        <label htmlFor="title">Title</label>
        <input
          id="title"
          data-testid="title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="cost">Cost</label>
        <input
          id="cost"
          type="number"
          data-testid="cost-input"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
        />

        {error ? <p data-testid="form-error">{error}</p> : null}

        <button type="submit" data-testid="submit-activity">
          Add
        </button>
      </form>
    </section>
  )
}
