'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { AppStatus } from '../lib/types'

const STATUSES: AppStatus[] = ['booked', 'done', 'no-show']

export function Appointments() {
  const { appointments, filter, setFilter, addAppointment, deleteAppointment, changeStatus } = useApp()
  const [customer, setCustomer] = useState('')
  const [service, setService] = useState('')
  const [status, setStatus] = useState<AppStatus>('booked')

  const countAll = appointments.length
  const countBooked = appointments.filter((a) => a.status === 'booked').length
  const countDone = appointments.filter((a) => a.status === 'done').length
  const countNoShow = appointments.filter((a) => a.status === 'no-show').length

  const visible = filter === 'all' ? appointments : appointments.filter((a) => a.status === filter)

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
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
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
        <button onClick={() => setFilter('all')}>{`All (${countAll})`}</button>
        <button onClick={() => setFilter('booked')}>{`Booked (${countBooked})`}</button>
        <button onClick={() => setFilter('done')}>{`Done (${countDone})`}</button>
        <button onClick={() => setFilter('no-show')}>{`No-show (${countNoShow})`}</button>
      </div>
      <p>{`Showing: ${visible.length} appointment(s)`}</p>
      <ul>
        {visible.map((a) => (
          <li key={a.id}>
            <span>{a.customer}</span>
            <span>{a.service}</span>
            <span>{a.status}</span>
            <select
              aria-label={`Status for ${a.customer}`}
              value={a.status}
              onChange={(e) => changeStatus(a.id, e.target.value as AppStatus)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button onClick={() => deleteAppointment(a.id)}>{`Delete ${a.customer}`}</button>
          </li>
        ))}
      </ul>
    </section>
  )
}
