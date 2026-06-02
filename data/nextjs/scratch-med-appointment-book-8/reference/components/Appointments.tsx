'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { AppStatus } from '../lib/types'

export function Appointments() {
  const { appointments, addAppointment, deleteAppointment, markDone } = useApp()
  const [customer, setCustomer] = useState('')
  const [service, setService] = useState('')
  const [status, setStatus] = useState<AppStatus>('booked')
  const [filter, setFilter] = useState<AppStatus | 'all'>('all')

  const filtered =
    filter === 'all' ? appointments : appointments.filter((a) => a.status === filter)

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
        <button
          onClick={() => {
            addAppointment(customer, service, status)
            setCustomer('')
            setService('')
            setStatus('booked')
          }}
        >
          Add Appointment
        </button>
      </div>
      <div>
        <select
          aria-label="Filter by status"
          value={filter}
          onChange={(e) => setFilter(e.target.value as AppStatus | 'all')}
        >
          <option value="all">all</option>
          <option value="booked">booked</option>
          <option value="done">done</option>
          <option value="no-show">no-show</option>
        </select>
      </div>
      <p>{`Showing: ${filtered.length} of ${appointments.length}`}</p>
      <ul>
        {filtered.map((a) => (
          <li key={a.id}>
            <span>{a.customer}</span>
            <span>{a.service}</span>
            <span>{a.status}</span>
            <button onClick={() => markDone(a.id)}>Mark done</button>
            <button onClick={() => deleteAppointment(a.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </section>
  )
}
