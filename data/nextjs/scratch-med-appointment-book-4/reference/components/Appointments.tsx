'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { AppStatus } from '../lib/types'

const STATUSES: AppStatus[] = ['booked', 'done', 'no-show']

export function Appointments() {
  const { appointments, addAppointment, deleteAppointment } = useApp()
  const [customer, setCustomer] = useState('')
  const [service, setService] = useState('')
  const [status, setStatus] = useState<AppStatus>('booked')
  const [filter, setFilter] = useState<AppStatus | 'all'>('all')

  const visible = filter === 'all' ? appointments : appointments.filter((a) => a.status === filter)

  return (
    <section aria-label="Appointments view">
      <h1>Appointments</h1>
      <div>
        <label htmlFor="customer-input">Customer</label>
        <input
          id="customer-input"
          aria-label="Customer"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="service-input">Service</label>
        <input
          id="service-input"
          aria-label="Service"
          value={service}
          onChange={(e) => setService(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="status-select">Status</label>
        <select
          id="status-select"
          aria-label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as AppStatus)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
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
      <div>
        <label htmlFor="filter-select">Filter by status</label>
        <select
          id="filter-select"
          aria-label="Filter by status"
          value={filter}
          onChange={(e) => setFilter(e.target.value as AppStatus | 'all')}
        >
          <option value="all">all</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <ul>
        {visible.map((a) => (
          <li key={a.id}>
            <span>{a.customer}</span>
            <span>{a.service}</span>
            <span>{a.status}</span>
            <button aria-label={`Delete ${a.customer}`} onClick={() => deleteAppointment(a.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      <p>{`Showing: ${visible.length}`}</p>
    </section>
  )
}
