'use client'
import { useState } from 'react'

interface SleepRecord {
  id: number
  date: string
  bedtime: string
  wake: string
  hours: number
  quality: string
}

function calcHours(bedtime: string, wake: string): number {
  const [bh, bm] = bedtime.split(':').map(Number)
  const [wh, wm] = wake.split(':').map(Number)
  let diff = (wh * 60 + wm) - (bh * 60 + bm)
  if (diff <= 0) diff += 24 * 60
  return Math.round((diff / 60) * 10) / 10
}

const SEED: SleepRecord[] = [
  { id: 1, date: '2024-01-15', bedtime: '23:00', wake: '07:00', hours: calcHours('23:00', '07:00'), quality: 'Good' },
  { id: 2, date: '2024-01-16', bedtime: '00:30', wake: '06:30', hours: calcHours('00:30', '06:30'), quality: 'Fair' },
  { id: 3, date: '2024-01-17', bedtime: '22:00', wake: '06:00', hours: calcHours('22:00', '06:00'), quality: 'Excellent' },
]

export default function App() {
  const [records, setRecords] = useState<SleepRecord[]>(SEED.map(r => ({ ...r })))
  const [date, setDate] = useState('')
  const [bedtime, setBedtime] = useState('')
  const [wake, setWake] = useState('')
  const [quality, setQuality] = useState('Excellent')
  const [nextId, setNextId] = useState(SEED.length + 1)

  const avg = records.length === 0
    ? 0
    : Math.round((records.reduce((s, r) => s + r.hours, 0) / records.length) * 10) / 10

  function handleAdd() {
    if (!date.trim() || !bedtime.trim() || !wake.trim()) return
    const hours = calcHours(bedtime, wake)
    setRecords(prev => [...prev, { id: nextId, date, bedtime, wake, hours, quality }])
    setNextId(n => n + 1)
    setDate('')
    setBedtime('')
    setWake('')
    setQuality('Excellent')
  }

  function handleClear() {
    setRecords([])
  }

  return (
    <div>
      <h1>Sleep Log</h1>
      <p data-testid="avg-sleep">Avg: {avg.toFixed(1)} hrs</p>
      <ul>
        {records.map(r => (
          <li key={r.id} data-testid="sleep-record">
            {r.date} | Bed: {r.bedtime} | Wake: {r.wake} | {r.hours.toFixed(1)} hrs | {r.quality}
          </li>
        ))}
      </ul>
      <div>
        <label>
          Date
          <input type="date" aria-label="Date" value={date} onChange={e => setDate(e.target.value)} />
        </label>
        <label>
          Bedtime
          <input type="time" aria-label="Bedtime" value={bedtime} onChange={e => setBedtime(e.target.value)} />
        </label>
        <label>
          Wake Time
          <input type="time" aria-label="Wake Time" value={wake} onChange={e => setWake(e.target.value)} />
        </label>
        <label>
          Quality
          <select aria-label="Quality" value={quality} onChange={e => setQuality(e.target.value)}>
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
          </select>
        </label>
        <button onClick={handleAdd}>Add Record</button>
      </div>
      <button onClick={handleClear}>Clear All</button>
    </div>
  )
}
