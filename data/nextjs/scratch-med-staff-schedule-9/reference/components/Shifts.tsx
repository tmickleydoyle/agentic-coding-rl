'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Shifts() {
  const { shifts, addShift, removeShift } = useApp()
  const [employee, setEmployee] = useState('')
  const [hours, setHours] = useState('')
  const [filter, setFilter] = useState('All')

  // unique employees in insertion order
  const employees: string[] = []
  shifts.forEach((s) => {
    if (!employees.includes(s.employee)) employees.push(s.employee)
  })

  const visible = filter === 'All' ? shifts : shifts.filter((s) => s.employee === filter)
  const totalHours = visible.reduce((sum, s) => sum + s.hours, 0)

  // if the filtered employee was removed entirely, reset filter
  const safeFilter = employees.includes(filter) ? filter : 'All'
  const visibleSafe = safeFilter === 'All' ? shifts : shifts.filter((s) => s.employee === safeFilter)
  const totalSafe = visibleSafe.reduce((sum, s) => sum + s.hours, 0)

  const displayShifts = safeFilter === 'All' ? shifts : shifts.filter((s) => s.employee === safeFilter)
  const displayTotal = displayShifts.reduce((sum, s) => sum + s.hours, 0)

  return (
    <section aria-label="Shifts view">
      <h1>Shifts</h1>
      <input
        aria-label="Employee name"
        value={employee}
        onChange={(e) => setEmployee(e.target.value)}
      />
      <input
        aria-label="Hours"
        type="number"
        value={hours}
        onChange={(e) => setHours(e.target.value)}
      />
      <button
        onClick={() => {
          addShift(employee, Number(hours))
          setEmployee('')
          setHours('')
        }}
      >
        Add shift
      </button>
      <label htmlFor="filter-select">Filter by employee</label>
      <select
        id="filter-select"
        aria-label="Filter by employee"
        value={safeFilter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="All">All</option>
        {employees.map((emp) => (
          <option key={emp} value={emp}>{emp}</option>
        ))}
      </select>
      <ul>
        {displayShifts.map((s) => (
          <li key={s.id}>
            <span>{`${s.employee} — ${s.hours} hrs`}</span>
            <button aria-label={`Remove shift ${s.id}`} onClick={() => removeShift(s.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <p>{`Total hours: ${displayTotal}`}</p>
    </section>
  )
}
