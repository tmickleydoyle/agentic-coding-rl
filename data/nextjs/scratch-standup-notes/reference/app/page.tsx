'use client'
import { useState } from 'react'

interface Member {
  id: number
  name: string
  yesterday: string
  today: string
  blockers: string
}

const SEED_DATE = '2024-01-15'

const SEED_MEMBERS: Member[] = [
  { id: 1, name: 'Alice', yesterday: '', today: '', blockers: '' },
  { id: 2, name: 'Bob', yesterday: '', today: '', blockers: '' },
  { id: 3, name: 'Carol', yesterday: '', today: '', blockers: '' },
]

export default function App() {
  const [date, setDate] = useState(SEED_DATE)
  const [members, setMembers] = useState<Member[]>(SEED_MEMBERS.map(m => ({ ...m })))
  const [newName, setNewName] = useState('')
  const [output, setOutput] = useState<string | null>(null)
  const [nextId, setNextId] = useState(4)

  function updateField(id: number, field: 'yesterday' | 'today' | 'blockers', value: string) {
    setMembers(ms => ms.map(m => m.id === id ? { ...m, [field]: value } : m))
  }

  function addMember() {
    if (!newName.trim()) return
    setMembers(ms => [...ms, { id: nextId, name: newName.trim(), yesterday: '', today: '', blockers: '' }])
    setNextId(n => n + 1)
    setNewName('')
  }

  function removeMember(id: number) {
    setMembers(ms => ms.filter(m => m.id !== id))
  }

  function clearAll() {
    setMembers(ms => ms.map(m => ({ ...m, yesterday: '', today: '', blockers: '' })))
    setOutput(null)
  }

  function generate() {
    const lines: string[] = [`Standup Notes - ${date}`, '']
    members.forEach((m, i) => {
      lines.push(m.name)
      lines.push(`  Yesterday: ${m.yesterday.trim() || 'None'}`)
      lines.push(`  Today: ${m.today.trim() || 'None'}`)
      lines.push(`  Blockers: ${m.blockers.trim() || 'None'}`)
      if (i < members.length - 1) lines.push('')
    })
    setOutput(lines.join('\n'))
  }

  return (
    <div>
      <h1>Standup Notes</h1>
      <div>
        <label>
          Date
          <input
            aria-label="Date"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </label>
      </div>
      <span data-testid="member-count">{members.length}</span>
      {members.map(m => (
        <div key={m.id} data-testid="member-section">
          <h2>{m.name}</h2>
          <div>
            <label>
              {m.name} - Yesterday
              <textarea
                aria-label={`${m.name} - Yesterday`}
                value={m.yesterday}
                onChange={e => updateField(m.id, 'yesterday', e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              {m.name} - Today
              <textarea
                aria-label={`${m.name} - Today`}
                value={m.today}
                onChange={e => updateField(m.id, 'today', e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              {m.name} - Blockers
              <textarea
                aria-label={`${m.name} - Blockers`}
                value={m.blockers}
                onChange={e => updateField(m.id, 'blockers', e.target.value)}
              />
            </label>
          </div>
          <button aria-label={`Remove ${m.name}`} onClick={() => removeMember(m.id)}>Remove</button>
        </div>
      ))}
      <div>
        <input
          aria-label="New Member Name"
          value={newName}
          onChange={e => setNewName(e.target.value)}
        />
        <button onClick={addMember}>Add Member</button>
      </div>
      <button onClick={generate}>Generate</button>
      <button onClick={clearAll}>Clear All</button>
      {output !== null && (
        <div data-testid="output">
          <pre>{output}</pre>
        </div>
      )}
    </div>
  )
}
