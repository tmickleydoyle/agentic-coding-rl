'use client'
import { useState } from 'react'

interface Topic {
  id: number
  name: string
  pros: string[]
  cons: string[]
}

const SEED_TOPICS: Topic[] = [
  {
    id: 1,
    name: 'Remote Work',
    pros: ['Flexible schedule', 'No commute'],
    cons: ['Isolation', 'Home distractions'],
  },
  {
    id: 2,
    name: 'Office Work',
    pros: ['Team collaboration', 'Structured environment'],
    cons: ['Commute time', 'Less flexibility'],
  },
]

export default function App() {
  const [topics, setTopics] = useState<Topic[]>(SEED_TOPICS.map(t => ({ ...t, pros: [...t.pros], cons: [...t.cons] })))
  const [activeId, setActiveId] = useState(1)
  const [nextId, setNextId] = useState(3)
  const [newPro, setNewPro] = useState('')
  const [newCon, setNewCon] = useState('')
  const [newTopic, setNewTopic] = useState('')

  const active = topics.find(t => t.id === activeId)!

  function updateActive(fn: (t: Topic) => Topic) {
    setTopics(ts => ts.map(t => t.id === activeId ? fn(t) : t))
  }

  function addPro() {
    const text = newPro.trim()
    if (!text) return
    updateActive(t => ({ ...t, pros: [...t.pros, text] }))
    setNewPro('')
  }

  function addCon() {
    const text = newCon.trim()
    if (!text) return
    updateActive(t => ({ ...t, cons: [...t.cons, text] }))
    setNewCon('')
  }

  function removePro(index: number) {
    updateActive(t => ({ ...t, pros: t.pros.filter((_, i) => i !== index) }))
  }

  function removeCon(index: number) {
    updateActive(t => ({ ...t, cons: t.cons.filter((_, i) => i !== index) }))
  }

  function addTopic() {
    const name = newTopic.trim()
    if (!name) return
    const id = nextId
    setNextId(id + 1)
    setTopics(ts => [...ts, { id, name, pros: [], cons: [] }])
    setActiveId(id)
    setNewTopic('')
  }

  const score = active.pros.length - active.cons.length
  const scoreStr = score > 0 ? `+${score}` : `${score}`

  return (
    <div>
      <h1>Pros &amp; Cons</h1>

      <div>
        <label>
          Select Topic
          <select value={activeId} onChange={e => setActiveId(Number(e.target.value))}>
            {topics.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </label>
      </div>

      <h2 data-testid="topic-title">{active.name}</h2>

      <div style={{ display: 'flex', gap: '2rem' }}>
        <div>
          <h3>Pros</h3>
          <ul>
            {active.pros.map((p, i) => (
              <li key={i} data-testid="pro-item">
                {p}
                <button aria-label={`Remove pro: ${p}`} onClick={() => removePro(i)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Cons</h3>
          <ul>
            {active.cons.map((c, i) => (
              <li key={i} data-testid="con-item">
                {c}
                <button aria-label={`Remove con: ${c}`} onClick={() => removeCon(i)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p>
        Pros: <span data-testid="pro-count">{active.pros.length}</span>
        {' | '}
        Cons: <span data-testid="con-count">{active.cons.length}</span>
      </p>
      <p>Score: <span data-testid="score">{scoreStr}</span></p>

      <div>
        <label>
          New Pro
          <input value={newPro} onChange={e => setNewPro(e.target.value)} />
        </label>
        <button onClick={addPro}>Add Pro</button>
      </div>

      <div>
        <label>
          New Con
          <input value={newCon} onChange={e => setNewCon(e.target.value)} />
        </label>
        <button onClick={addCon}>Add Con</button>
      </div>

      <div>
        <label>
          New Topic
          <input value={newTopic} onChange={e => setNewTopic(e.target.value)} />
        </label>
        <button onClick={addTopic}>Add Topic</button>
      </div>
    </div>
  )
}
