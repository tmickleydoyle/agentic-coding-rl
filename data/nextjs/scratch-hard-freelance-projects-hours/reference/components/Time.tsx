'use client'
import { useState } from 'react'
import { useStudio } from '../hooks/useStudio'

export function Time() {
  const { entries, projects, addEntry } = useStudio()
  const [task, setTask] = useState('')
  const [hours, setHours] = useState('')
  const [project, setProject] = useState(projects[0].name)
  const [billable, setBillable] = useState(true)

  return (
    <section aria-label="Time view">
      <h1>Time</h1>
      <input aria-label="Task" value={task} onChange={(e) => setTask(e.target.value)} />
      <input aria-label="Hours" type="number" value={hours} onChange={(e) => setHours(e.target.value)} />
      <select aria-label="Project" value={project} onChange={(e) => setProject(e.target.value)}>
        {projects.map((p) => (
          <option key={p.name} value={p.name}>
            {p.name}
          </option>
        ))}
      </select>
      <label>
        Billable
        <input type="checkbox" checked={billable} onChange={(e) => setBillable(e.target.checked)} />
      </label>
      <button
        onClick={() => {
          addEntry(task, project, hours, billable)
          setTask('')
          setHours('')
        }}
      >
        Log time
      </button>
      <ul>
        {entries.map((en) => (
          <li key={en.id}>
            {`${en.task} — ${en.hours} h — ${en.project} — ${en.billable ? 'BILLABLE' : 'NON-BILLABLE'}`}
          </li>
        ))}
      </ul>
    </section>
  )
}
