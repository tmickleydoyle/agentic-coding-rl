'use client'
import { useState } from 'react'

interface Criterion {
  id: number
  name: string
  weight: number
}

interface Option {
  id: number
  name: string
  scores: Record<number, number>
}

const SEED_CRITERIA: Criterion[] = [
  { id: 1, name: 'Cost', weight: 3 },
  { id: 2, name: 'Performance', weight: 5 },
  { id: 3, name: 'Ease of Use', weight: 4 },
]

const SEED_OPTIONS: Option[] = [
  { id: 1, name: 'Option A', scores: { 1: 5, 2: 5, 3: 5 } },
  { id: 2, name: 'Option B', scores: { 1: 5, 2: 5, 3: 5 } },
  { id: 3, name: 'Option C', scores: { 1: 5, 2: 5, 3: 5 } },
]

function toId(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-')
}

function computeTotal(option: Option, criteria: Criterion[]): number {
  let total = 0
  criteria.forEach(c => {
    total += (option.scores[c.id] ?? 5) * c.weight
  })
  return total
}

function computeRanks(options: Option[], criteria: Criterion[]): Record<number, number> {
  const totals = options.map(o => ({ id: o.id, total: computeTotal(o, criteria) }))
  const sorted = [...totals].sort((a, b) => b.total - a.total)
  const ranks: Record<number, number> = {}
  let rank = 1
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i].total < sorted[i - 1].total) {
      rank = i + 1
    }
    ranks[sorted[i].id] = rank
  }
  return ranks
}

export default function App() {
  const [criteria, setCriteria] = useState<Criterion[]>(SEED_CRITERIA.map(c => ({ ...c })))
  const [options, setOptions] = useState<Option[]>(SEED_OPTIONS.map(o => ({ ...o, scores: { ...o.scores } })))
  const [nextCritId, setNextCritId] = useState(4)
  const [nextOptId, setNextOptId] = useState(4)
  const [newCritName, setNewCritName] = useState('')
  const [newCritWeight, setNewCritWeight] = useState('1')
  const [newOptName, setNewOptName] = useState('')

  function handleScoreChange(optionId: number, critId: number, value: string) {
    const num = parseInt(value, 10)
    if (!isFinite(num)) return
    setOptions(opts =>
      opts.map(o =>
        o.id === optionId ? { ...o, scores: { ...o.scores, [critId]: num } } : o
      )
    )
  }

  function addCriterion() {
    const name = newCritName.trim()
    const weight = parseInt(newCritWeight, 10)
    if (!name || !isFinite(weight) || weight < 1) return
    const id = nextCritId
    setNextCritId(id + 1)
    setCriteria(cs => [...cs, { id, name, weight }])
    setOptions(opts =>
      opts.map(o => ({ ...o, scores: { ...o.scores, [id]: 5 } }))
    )
    setNewCritName('')
    setNewCritWeight('1')
  }

  function addOption() {
    const name = newOptName.trim()
    if (!name) return
    const id = nextOptId
    setNextOptId(id + 1)
    const scores: Record<number, number> = {}
    criteria.forEach(c => { scores[c.id] = 5 })
    setOptions(opts => [...opts, { id, name, scores }])
    setNewOptName('')
  }

  const ranks = computeRanks(options, criteria)

  return (
    <div>
      <h1>Decision Matrix</h1>

      <table>
        <thead>
          <tr>
            <th>Option</th>
            {criteria.map(c => (
              <th key={c.id}>{c.name} (w={c.weight})</th>
            ))}
            <th>Total</th>
            <th>Rank</th>
          </tr>
        </thead>
        <tbody>
          {options.map(o => {
            const total = computeTotal(o, criteria)
            const rank = ranks[o.id]
            const oid = toId(o.name)
            return (
              <tr key={o.id}>
                <td>{o.name}</td>
                {criteria.map(c => (
                  <td key={c.id}>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      aria-label={`Score for ${o.name} on ${c.name}`}
                      value={o.scores[c.id] ?? 5}
                      onChange={e => handleScoreChange(o.id, c.id, e.target.value)}
                    />
                  </td>
                ))}
                <td data-testid={`total-${oid}`}>{total}</td>
                <td data-testid={`rank-${oid}`}>{rank}</td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr>
            <td>Weights</td>
            {criteria.map(c => (
              <td key={c.id}>{c.weight}</td>
            ))}
            <td></td>
            <td></td>
          </tr>
        </tfoot>
      </table>

      <div>
        <h2>Add Criterion</h2>
        <label>
          Criterion Name
          <input
            value={newCritName}
            onChange={e => setNewCritName(e.target.value)}
          />
        </label>
        <label>
          Weight
          <input
            type="number"
            min={1}
            value={newCritWeight}
            onChange={e => setNewCritWeight(e.target.value)}
          />
        </label>
        <button onClick={addCriterion}>Add Criterion</button>
      </div>

      <div>
        <h2>Add Option</h2>
        <label>
          Option Name
          <input
            value={newOptName}
            onChange={e => setNewOptName(e.target.value)}
          />
        </label>
        <button onClick={addOption}>Add Option</button>
      </div>
    </div>
  )
}
