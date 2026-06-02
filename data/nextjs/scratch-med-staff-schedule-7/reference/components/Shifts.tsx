'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Shifts() {
  const { shifts, addShift, deleteShift } = useApp()
  const [employee, setEmployee] = useState('')
  const [hours, setHours] = useState('')
  const [filter, setFilter] = useState('All')

  const employees: string[] = []
  shifts.forEach((s) => {
    if (!employees.includes(s.employee)) employees.push(s.employee)
  })

  const visible = filter === 'All' ? shifts : shifts.filter((s) => s.employee === filter)
  const visibleTotal = visible.reduce((sum, s) => sum + s.hours, 0)

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
          value={hours}
          onChange={(e) => setHours(e.target.value)}
        />
        <button onClick={handleAdd}>Add shift</button>
      </div>
      <div>
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
      </div>
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
