'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { AppStatus } from '../lib/types'

type Filter = 'all' | AppStatus

const FILTERS: [Filter, string][] = [
  ['all', 'All'],
  ['booked', 'Booked'],
  ['done', 'Done'],
  ['no-show', 'No-show'],
]

export function Appointments() {
  const { appointments, addAppointment, markStatus, deleteAppointment } = useApp()
  const [customer, setCustomer] = useState('')
  const [service, setService] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const visible = filter === 'all' ? appointments : appointments.filter((a) => a.status === filter)

  return (
    <section aria-label="Appointments view">
      <h1>Appointments</h1>
      <div>
        <input
          aria-label="Customer name"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
        />
        <input
          aria-label="Service"
          value={service}
          onChange={(e) => setService(e.target.value)}
        />
        <button
          onClick={() => {
            addAppointment(customer, service)
            setCustomer('')
            setService('')
          }}
        >
          Add appointment
        </button>
      </div>
      <div>
        {FILTERS.map(([f, label]) => (
          <button
            key={f}
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
          >
            {label}
          </button>
        ))}
      </div>
      <p>{`Showing: ${visible.length} appointments`}</p>
      <ul>
        {visible.map((a) => (
          <li key={a.id}>
            <span>{a.customer}</span>
            <span>{a.service}</span>
            <span>{a.status}</span>
            <button
              aria-label={`Mark ${a.customer} done`}
              disabled={a.status === 'done'}
              onClick={() => markStatus(a.id, 'done')}
            >
              Mark done
            </button>
            <button
              aria-label={`Mark ${a.customer} no-show`}
              disabled={a.status === 'no-show'}
              onClick={() => markStatus(a.id, 'no-show')}
            >
              Mark no-show
            </button>
            <button
              aria-label={`Delete ${a.customer}`}
              onClick={() => deleteAppointment(a.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
