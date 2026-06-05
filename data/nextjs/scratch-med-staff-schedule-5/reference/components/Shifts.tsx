'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Shifts() {
  const { shifts, addShift, removeShift } = useApp()
  const [name, setName] = useState('')
  const [hours, setHours] = useState('')
  const [filter, setFilter] = useState('All')

  const employees = Array.from(new Set(shifts.map((s) => s.name))).sort()

  const visible = filter === 'All' ? shifts : shifts.filter((s) => s.name === filter)
  const showingTotal = visible.reduce((sum, s) => sum + s.hours, 0)

  function handleAdd() {
    const h = parseInt(hours, 10)
    addShift(name, h)
    setName('')
    setHours('')
  }

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
      <button onClick={handleAdd}>Add shift</button>

      <label>
        Filter by employee
        <select
          aria-label="Filter by employee"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          {employees.map((emp) => (
            <option key={emp} value={emp}>
              {emp}
            </option>
          ))}
        </select>
      </label>

      <ul>
        {visible.map((s) => (
          <li key={s.id}>
            <span>{`${s.name} — ${s.hours} hrs`}</span>
            <button aria-label={`Remove shift ${s.id}`} onClick={() => removeShift(s.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>

      <p>{`Showing total: ${showingTotal} hrs`}</p>
    </section>
  )
}
