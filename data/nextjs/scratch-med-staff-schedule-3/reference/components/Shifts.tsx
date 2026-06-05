'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Shifts() {
  const { shifts, filter, addShift, deleteShift, setFilter } = useApp()
  const [name, setName] = useState('')
  const [hours, setHours] = useState('')

  const employees = Array.from(new Set(shifts.map((s) => s.name))).sort()

  const visible = filter === 'All' ? shifts : shifts.filter((s) => s.name === filter)
  const total = visible.reduce((acc, s) => acc + s.hours, 0)

  return (
    <section aria-label="Shifts view">
      <h1>Shifts</h1>
      <input
        aria-label="Employee name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        aria-label="Hours"
        type="number"
        value={hours}
        onChange={(e) => setHours(e.target.value)}
      />
      <button
        onClick={() => {
          const h = parseFloat(hours)
          addShift(name, h)
          setName('')
          setHours('')
        }}
      >
        Add shift
      </button>
      <label htmlFor="filter-select">Filter by employee</label>
      <select
        id="filter-select"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="All">All</option>
        {employees.map((emp) => (
          <option key={emp} value={emp}>{emp}</option>
        ))}
      </select>
      <ul>
        {visible.map((s) => (
          <li key={s.id}>
            <span>{`${s.name} — ${s.hours}h`}</span>
            <button
              aria-label={`Delete shift for ${s.name}`}
              onClick={() => deleteShift(s.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <p>{`Showing: ${total} total hours`}</p>
    </section>
  )
}
