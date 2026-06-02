'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { AppStatus } from '../lib/types'

type FilterOption = 'All' | AppStatus

export function Appointments() {
  const { appointments, addAppointment, markDone, markNoShow } = useApp()
  const [customer, setCustomer] = useState('')
  const [service, setService] = useState('')
  const [filter, setFilter] = useState<FilterOption>('All')

  const visible =
    filter === 'All' ? appointments : appointments.filter((a) => a.status === filter)

  return (
    <section aria-label="Appointments view">
      <h1>{`Appointments (${visible.length})`}</h1>
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
        <label htmlFor="filter-status">Filter by status</label>
        <select
          id="filter-status"
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterOption)}
        >
          <option value="All">All</option>
          <option value="booked">booked</option>
          <option value="done">done</option>
          <option value="no-show">no-show</option>
        </select>
      </div>
      <ul>
        {visible.map((a) => (
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
