'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { useAppointments } from '../../hooks/useAppointments'

export default function BookPage() {
  const { providers, selectedProviderId, book, navigate } = useApp()
  const { freeSlots } = useAppointments()
  const [patient, setPatient] = useState('')
  const [error, setError] = useState('')
  const [slotError, setSlotError] = useState(false)

  const provider = providers.find((p) => p.id === selectedProviderId) ?? null
  const available = provider ? freeSlots(provider.id) : []
  const [date, setDate] = useState('')

  if (!provider) {
    return (
      <section data-testid="page-book">
        <h1>Book</h1>
        <p data-testid="no-provider">Pick a provider first.</p>
      </section>
    )
  }

  if (available.length === 0) {
    return (
      <section data-testid="page-book">
        <h1>Book</h1>
        <p data-testid="selected-provider">{provider.name}</p>
        <p data-testid="no-slots">No available slots.</p>
      </section>
    )
  }

  const effectiveDate = date || available[0]

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSlotError(false)
    if (patient.trim().length === 0) {
      setError('Patient is required')
      return
    }
    setError('')
    const ok = book({ providerId: provider.id, date: effectiveDate, patient: patient.trim() })
    if (!ok) {
      setSlotError(true)
      return
    }
    setPatient('')
    navigate('appointments')
  }

  return (
    <section data-testid="page-book">
      <h1>Book</h1>
      <p data-testid="selected-provider">{provider.name}</p>
      <form data-testid="appointment-form" onSubmit={onSubmit}>
        <label htmlFor="patient">Patient</label>
        <input
          id="patient"
          data-testid="patient-input"
          value={patient}
          onChange={(e) => setPatient(e.target.value)}
        />

        <label htmlFor="slot">Slot</label>
        <select
          id="slot"
          data-testid="slot-select"
          value={effectiveDate}
          onChange={(e) => setDate(e.target.value)}
        >
          {available.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {error ? <p data-testid="form-error">{error}</p> : null}
        {slotError ? <p data-testid="slot-error">That slot is no longer available.</p> : null}

        <button type="submit" data-testid="submit-appointment">
          Book appointment
        </button>
      </form>
    </section>
  )
}
