'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'

export default function AddEntryPage() {
  const { members, addEntry, navigate } = useApp()
  const [memberId, setMemberId] = useState(members[0]?.id ?? '')
  const [yesterday, setYesterday] = useState('')
  const [today, setToday] = useState('')
  const [blocker, setBlocker] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (yesterday.trim().length === 0 || today.trim().length === 0) {
      setError('Yesterday and today are required')
      return
    }
    setError('')
    addEntry({
      memberId,
      yesterday: yesterday.trim(),
      today: today.trim(),
      blocker: blocker.trim().length > 0 ? blocker.trim() : null,
    })
    setYesterday('')
    setToday('')
    setBlocker('')
    navigate('today')
  }

  return (
    <section data-testid="page-add-entry">
      <h1>Add standup</h1>
      <form data-testid="add-form" onSubmit={onSubmit}>
        <label htmlFor="member">Member</label>
        <select
          id="member"
          data-testid="member-select"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
        >
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>

        <label htmlFor="yesterday">Yesterday</label>
        <input
          id="yesterday"
          data-testid="yesterday-input"
          value={yesterday}
          onChange={(e) => setYesterday(e.target.value)}
        />

        <label htmlFor="today">Today</label>
        <input
          id="today"
          data-testid="today-input"
          value={today}
          onChange={(e) => setToday(e.target.value)}
        />

        <label htmlFor="blocker">Blocker</label>
        <input
          id="blocker"
          data-testid="blocker-input"
          value={blocker}
          onChange={(e) => setBlocker(e.target.value)}
        />

        {error ? <p data-testid="form-error">{error}</p> : null}

        <button type="submit" data-testid="submit-entry">
          Add
        </button>
      </form>
    </section>
  )
}
