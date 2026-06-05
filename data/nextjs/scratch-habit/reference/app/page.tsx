'use client'
import { useState } from 'react'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
type Habit = { name: string; days: boolean[] }

function stats(days: boolean[]) {
  const done = days.filter(Boolean).length
  const pct = Math.round((done / DAYS.length) * 100)
  let cur = 0
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i]) cur++
    else break
  }
  let lon = 0
  let run = 0
  days.forEach((d) => {
    if (d) {
      run++
      if (run > lon) lon = run
    } else {
      run = 0
    }
  })
  return { cur, lon, pct }
}

export default function App() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [name, setName] = useState('')

  function add() {
    const n = name.trim()
    if (!n || habits.some((h) => h.name === n)) return
    setHabits((hs) => [...hs, { name: n, days: DAYS.map(() => false) }])
    setName('')
  }

  function toggle(habit: string, dayIdx: number) {
    setHabits((hs) =>
      hs.map((h) =>
        h.name === habit
          ? { ...h, days: h.days.map((d, i) => (i === dayIdx ? !d : d)) }
          : h,
      ),
    )
  }

  function remove(habit: string) {
    setHabits((hs) => hs.filter((h) => h.name !== habit))
  }

  return (
    <div>
      <h1>Habit Tracker</h1>
      <div>
        <input aria-label="Habit name" value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={add}>Add habit</button>
      </div>
      {habits.map((h) => {
        const s = stats(h.days)
        return (
          <section key={h.name} aria-label={h.name}>
            <h3>{h.name}</h3>
            {DAYS.map((d, di) => (
              <label key={d}>
                <input
                  type="checkbox"
                  aria-label={`${h.name} ${d}`}
                  checked={h.days[di]}
                  onChange={() => toggle(h.name, di)}
                />
                {d}
              </label>
            ))}
            <p>{`Current streak: ${s.cur}`}</p>
            <p>{`Longest streak: ${s.lon}`}</p>
            <p>{`Completion: ${s.pct}%`}</p>
            <button onClick={() => remove(h.name)}>{`Remove ${h.name}`}</button>
          </section>
        )
      })}
    </div>
  )
}
