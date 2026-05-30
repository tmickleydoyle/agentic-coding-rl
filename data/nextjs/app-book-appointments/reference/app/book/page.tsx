'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { useSchedule } from '../../hooks/useSchedule'

export default function BookPage() {
  const { services, selectedServiceId, book, navigate } = useApp()
  const { freeSlots } = useSchedule()
  const [customer, setCustomer] = useState('')
  const [error, setError] = useState('')
  const [slotError, setSlotError] = useState(false)

  const service = services.find((s) => s.id === selectedServiceId) ?? null
  const available = service ? freeSlots(service.id) : []
  const [slot, setSlot] = useState('')

  if (!service) {
    return (
      <section data-testid="page-book">
        <h1>Book</h1>
        <p data-testid="no-service">Pick a service first.</p>
      </section>
    )
  }

  const effectiveSlot = slot || available[0] || ''

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSlotError(false)
    if (customer.trim().length === 0) {
      setError('Customer is required')
      return
    }
    setError('')
    const ok = book({ serviceId: service.id, slot: effectiveSlot, customer: customer.trim() })
    if (!ok) {
      setSlotError(true)
      return
    }
    setCustomer('')
    navigate('my-bookings')
  }

  return (
    <section data-testid="page-book">
      <h1>Book</h1>
      <p data-testid="selected-service">{service.name}</p>
      <form data-testid="booking-form" onSubmit={onSubmit}>
        <label htmlFor="customer">Customer</label>
        <input
          id="customer"
          data-testid="customer-input"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
        />

        <label htmlFor="slot">Slot</label>
        <select
          id="slot"
          data-testid="slot-select"
          value={effectiveSlot}
          onChange={(e) => setSlot(e.target.value)}
        >
          {available.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {error ? <p data-testid="form-error">{error}</p> : null}
        {slotError ? <p data-testid="slot-error">That slot is taken.</p> : null}

        <button type="submit" data-testid="submit-booking">
          Book appointment
        </button>
      </form>
    </section>
  )
}
