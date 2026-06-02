'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Shifts() {
  const { shifts, addShift, removeShift } = useApp()
  const [name, setName] = useState('')
  const [hours, setHours] = useState('')
  const [filter, setFilter] = useState('All')

  const uniqueNames: string[] = []
  shifts.forEach((s) => {
    if (!uniqueNames.includes(s.name)) uniqueNames.push(s.name)
  })

  const visible = filter === 'All' ? shifts : shifts.filter((s) => s.name === filter)

  function handleAdd() {
    const h = parseFloat(hours)
    addShift(name, h)
    setName('')
    setHours('')
  }

  return (
    <section aria-label="Shifts view">
      <h1>Shifts</h1>
      <div>
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
      </div>
      <div>
        <label htmlFor="employee-filter">Filter by employee</label>
        <select
          id="employee-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          {uniqueNames.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>
      <p>{`Showing: ${visible.length} shifts`}</p>
      <ul>
        {visible.map((s) => (
          <li key={s.id}>
            <span>{`${s.name} — ${s.hours} hrs`}</span>
            <button aria-label={`Remove shift ${s.id}`} onClick={() => removeShift(s.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </section>
  )
}
