'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import { formatHours } from '../lib/format'

export function Shifts() {
  const { shifts, addShift, removeShift } = useApp()
  const [employee, setEmployee] = useState('')
  const [hours, setHours] = useState('')
  const [filter, setFilter] = useState('All employees')

  const uniqueEmployees: string[] = []
  shifts.forEach((s) => {
    if (!uniqueEmployees.includes(s.employee)) uniqueEmployees.push(s.employee)
  })

  // reset filter if employee no longer exists
  const effectiveFilter = uniqueEmployees.includes(filter) ? filter : 'All employees'

  const visible = effectiveFilter === 'All employees'
    ? shifts
    : shifts.filter((s) => s.employee === effectiveFilter)

  const totalHours = visible.reduce((sum, s) => sum + s.hours, 0)

  function handleAdd() {
    const h = parseFloat(hours)
    addShift(employee, h)
    setEmployee('')
    setHours('')
  }

  return (
    <section aria-label="Shifts view">
      <h1>Shifts</h1>
      <div>
        <input
          aria-label="Employee name"
          value={employee}
          onChange={(e) => setEmployee(e.target.value)}
        />
        <input
          aria-label="Hours"
          type="number"
          min={0.5}
          step={0.5}
          value={hours}
          onChange={(e) => setHours(e.target.value)}
        />
        <button onClick={handleAdd}>Add shift</button>
      </div>
      <div>
        <label htmlFor="filter-select">Filter by employee</label>
        <select
          id="filter-select"
          value={effectiveFilter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All employees">All employees</option>
          {uniqueEmployees.map((emp) => (
            <option key={emp} value={emp}>{emp}</option>
          ))}
        </select>
      </div>
      <ul>
        {visible.map((s) => (
          <li key={s.id}>
            <span>{`${s.employee} — ${formatHours(s.hours)}`}</span>
            <button aria-label={`Remove shift ${s.id}`} onClick={() => removeShift(s.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <p>{`Total hours: ${formatHours(totalHours)}`}</p>
    </section>
  )
}
