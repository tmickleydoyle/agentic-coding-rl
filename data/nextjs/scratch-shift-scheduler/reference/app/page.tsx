'use client'
import { useState } from 'react'

const EMPLOYEES = [
  { id: 1, name: 'Alice Johnson' },
  { id: 2, name: 'Bob Martinez' },
  { id: 3, name: 'Carol White' },
  { id: 4, name: 'David Lee' },
]

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const SHIFTS = ['Morning', 'Afternoon', 'Night']

type Schedule = Record<string, string>

function makeKey(day: string, shift: string) {
  return `${day}-${shift}`
}

export default function App() {
  const [schedule, setSchedule] = useState<Schedule>({})
  const [day, setDay] = useState('Monday')
  const [shift, setShift] = useState('Morning')
  const [employee, setEmployee] = useState('')

  function handleAssign() {
    if (!employee) return
    setSchedule(prev => ({ ...prev, [makeKey(day, shift)]: employee }))
  }

  function handleClearAll() {
    setSchedule({})
  }

  // Build summary: employee -> count
  const summary: Record<string, number> = {}
  EMPLOYEES.forEach(e => {
    const count = Object.values(schedule).filter(v => v === e.name).length
    if (count > 0) summary[e.name] = count
  })

  return (
    <div>
      <h1>Shift Scheduler</h1>

      <table>
        <thead>
          <tr>
            <th>Day</th>
            {SHIFTS.map(s => <th key={s}>{s}</th>)}
          </tr>
        </thead>
        <tbody>
          {DAYS.map(d => (
            <tr key={d}>
              <td>{d}</td>
              {SHIFTS.map(s => (
                <td key={s} data-testid={`shift-cell-${d}-${s}`}>
                  {schedule[makeKey(d, s)] || 'Unassigned'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <select aria-label="Day" value={day} onChange={e => setDay(e.target.value)}>
          {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <select aria-label="Shift" value={shift} onChange={e => setShift(e.target.value)}>
          {SHIFTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select aria-label="Employee" value={employee} onChange={e => setEmployee(e.target.value)}>
          <option value="">-- Select Employee --</option>
          {EMPLOYEES.map(e => <option key={e.id} value={e.name}>{e.name}</option>)}
        </select>

        <button data-testid="assign-button" onClick={handleAssign}>Assign</button>
      </div>

      {Object.keys(summary).length > 0 && (
        <div>
          <h2>Employee Summary</h2>
          <ul>
            {Object.entries(summary).map(([name, count]) => (
              <li key={name} data-testid="summary-row">{name}: {count} shift{count !== 1 ? 's' : ''}</li>
            ))}
          </ul>
        </div>
      )}

      <button data-testid="clear-all" onClick={handleClearAll}>Clear All</button>
    </div>
  )
}
