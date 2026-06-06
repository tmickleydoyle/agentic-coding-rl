'use client'
import { useState } from 'react'

interface Observation {
  id: number
  date: string
  tempC: number
  condition: string
  humidity: number
  notes: string
}

const SEED_OBS: Observation[] = [
  { id: 1, date: '2024-01-15', tempC: 12, condition: 'sunny', humidity: 45, notes: 'Perfect gardening day' },
  { id: 2, date: '2024-01-14', tempC: 8, condition: 'cloudy', humidity: 70, notes: 'Too cold to work outside' },
  { id: 3, date: '2024-01-13', tempC: 5, condition: 'rainy', humidity: 90, notes: 'Heavy rain, soil saturated' },
  { id: 4, date: '2024-01-10', tempC: 15, condition: 'sunny', humidity: 40, notes: 'Watered plants in the evening' },
]

const CONDITIONS = ['sunny', 'cloudy', 'rainy', 'windy', 'snowy']

let nextId = 5

export default function App() {
  const [observations, setObservations] = useState<Observation[]>(SEED_OBS.map(o => ({ ...o })))
  const [date, setDate] = useState('')
  const [tempC, setTempC] = useState('')
  const [condition, setCondition] = useState('sunny')
  const [humidity, setHumidity] = useState('')
  const [notes, setNotes] = useState('')
  const [conditionFilter, setConditionFilter] = useState('All')

  const filtered = observations
    .filter(o => conditionFilter === 'All' || o.condition === conditionFilter)
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))

  const avgTemp = observations.length > 0
    ? Math.round((observations.reduce((s, o) => s + o.tempC, 0) / observations.length) * 10) / 10
    : 0

  const avgHumidity = observations.length > 0
    ? Math.round((observations.reduce((s, o) => s + o.humidity, 0) / observations.length) * 10) / 10
    : 0

  function getMostCommonCondition(): string {
    if (observations.length === 0) return ''
    const counts: { [key: string]: number } = {}
    observations.forEach(o => {
      counts[o.condition] = (counts[o.condition] ?? 0) + 1
    })
    let best = ''
    let bestCount = 0
    const sorted = Object.keys(counts).sort()
    sorted.forEach(c => {
      if (counts[c] > bestCount) {
        bestCount = counts[c]
        best = c
      }
    })
    return best
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!date || tempC === '') return
    const hum = Number(humidity)
    if (humidity === '' || hum < 0 || hum > 100) return
    const newObs: Observation = {
      id: nextId++,
      date,
      tempC: Number(tempC),
      condition,
      humidity: hum,
      notes,
    }
    setObservations(prev => [...prev, newObs])
    setDate('')
    setTempC('')
    setCondition('sunny')
    setHumidity('')
    setNotes('')
  }

  function handleDelete(id: number) {
    setObservations(prev => prev.filter(o => o.id !== id))
  }

  return (
    <div>
      <h1>Weather Notes</h1>

      <form data-testid="obs-form" onSubmit={handleSubmit}>
        <h2>Add Observation</h2>
        <input
          type="date"
          data-testid="obs-date-input"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
        <input
          type="number"
          data-testid="obs-temp-input"
          value={tempC}
          onChange={e => setTempC(e.target.value)}
          placeholder="Temperature (°C)"
        />
        <select
          data-testid="obs-condition-select"
          value={condition}
          onChange={e => setCondition(e.target.value)}
        >
          {CONDITIONS.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          type="number"
          data-testid="obs-humidity-input"
          value={humidity}
          onChange={e => setHumidity(e.target.value)}
          placeholder="Humidity (%)"
          min={0}
          max={100}
        />
        <textarea
          data-testid="obs-notes-input"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Notes (optional)"
        />
        <button type="submit" data-testid="add-obs-btn">Add Observation</button>
      </form>

      <select
        data-testid="condition-filter"
        value={conditionFilter}
        onChange={e => setConditionFilter(e.target.value)}
      >
        <option value="All">All</option>
        {CONDITIONS.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <div data-testid="obs-list">
        {observations.length === 0 ? (
          <p data-testid="no-obs-msg">No observations yet</p>
        ) : (
          filtered.map(obs => (
            <div key={obs.id} data-testid={`obs-row-${obs.id}`}>
              <span>{obs.date}</span>
              <span>{obs.tempC}°C</span>
              <span>{obs.condition}</span>
              <span>{obs.humidity}%</span>
              <span>{obs.notes}</span>
              <button
                data-testid={`delete-obs-${obs.id}`}
                onClick={() => handleDelete(obs.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      {observations.length > 0 && (
        <div data-testid="stats-panel">
          <h2>Statistics</h2>
          <p data-testid="avg-temp">Avg Temp: {avgTemp}°C</p>
          <p data-testid="avg-humidity">Avg Humidity: {avgHumidity}%</p>
          <p data-testid="common-condition">{getMostCommonCondition()}</p>
        </div>
      )}
    </div>
  )
}
