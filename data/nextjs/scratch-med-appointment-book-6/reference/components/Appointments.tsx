'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { AppStatus } from '../lib/types'

type Filter = 'all' | AppStatus

export function Appointments() {
  const { appointments, addAppointment, markDone, markNoShow } = useApp()
  const [customer, setCustomer] = useState('')
  const [service, setService] = useState('')
  const [status, setStatus] = useState<AppStatus>('booked')
  const [filter, setFilter] = useState<Filter>('all')

  const filtered =
    filter === 'all' ? appointments : appointments.filter((a) => a.status === filter)

  function handleAdd() {
    addAppointment(customer, service, status)
    setCustomer('')
    setService('')
    setStatus('booked')
  }

  return (
    <section aria-label="Appointments view">
      <h1>Appointments</h1>
      <div>
        <input
          aria-label="Customer"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
        />
        <input
          aria-label="Service"
          value={service}
          onChange={(e) => setService(e.target.value)}
        />
        <select
          aria-label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as AppStatus)}
        >
          <option value="booked">booked</option>
          <option value="done">done</option>
          <option value="no-show">no-show</option>
        </select>
        <button onClick={handleAdd}>Add Appointment</button>
      </div>
      <div>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('booked')}>Booked</button>
        <button onClick={() => setFilter('done')}>Done</button>
        <button onClick={() => setFilter('no-show')}>No-show</button>
      </div>
      <p>{`Showing: ${filtered.length}`}</p>
      <ul>
        {filtered.map((a) => (
          <li key={a.id}>
            <span>{a.customer}</span>
            <span>{a.service}</span>
            <span>{a.status}</span>
            <button
              aria-label={`Mark done ${a.customer}`}
              disabled={a.status === 'done'}
              onClick={() => markDone(a.id)}
            >
              Mark done
            </button>
            <button
              aria-label={`Mark no-show ${a.customer}`}
              disabled={a.status === 'no-show'}
              onClick={() => markNoShow(a.id)}
            >
              Mark no-show
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
