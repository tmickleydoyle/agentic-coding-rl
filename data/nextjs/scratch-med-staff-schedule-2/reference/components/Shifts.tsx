'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Shifts() {
  const { shifts, addShift, deleteShift } = useApp()
  const [employee, setEmployee] = useState('')
  const [hours, setHours] = useState('')
  const [filter, setFilter] = useState('All')

  const uniqueEmployees: string[] = []
  shifts.forEach((s) => {
    if (!uniqueEmployees.includes(s.employee)) uniqueEmployees.push(s.employee)
  })

  // Keep filter valid when the filtered employee has been fully deleted
  const effectiveFilter = uniqueEmployees.includes(filter) ? filter : 'All'

  const visible = effectiveFilter === 'All' ? shifts : shifts.filter((s) => s.employee === effectiveFilter)
  const visibleTotal = visible.reduce((acc, s) => acc + s.hours, 0)

  function handleAdd() {
    const h = parseFloat(hours)
    addShift(employee, h)
    setEmployee('')
    setHours('')
  }

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
      <button onClick={handleAdd}>Add shift</button>

      <label>
        Filter by employee
        <select
          aria-label="Filter by employee"
          value={effectiveFilter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          {uniqueEmployees.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </label>

      <ul>
        {visible.map((s) => (
          <li key={s.id}>
            <span>{`${s.employee} — ${s.hours}h`}</span>
            <button aria-label={`Delete shift ${s.id}`} onClick={() => deleteShift(s.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <p>{`Visible total: ${visibleTotal}h`}</p>
    </section>
  )
}
