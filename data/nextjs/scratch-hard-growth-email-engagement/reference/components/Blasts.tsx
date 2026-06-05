'use client'
import { useState } from 'react'
import { useGrowth } from '../hooks/useGrowth'
import { LISTS } from '../lib/types'

export function Blasts() {
  const { blasts, addBlast, openedOnly } = useGrowth()
  const [subject, setSubject] = useState('')
  const [list, setList] = useState('Newsletter')
  const [sent, setSent] = useState('')
  const [opens, setOpens] = useState('')
  const [clicks, setClicks] = useState('')

  const visible = blasts.filter((b) => !openedOnly || b.opens > 0)

  return (
    <section aria-label="Blasts view">
      <h1>Blasts</h1>
      <input aria-label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
      <select aria-label="List" value={list} onChange={(e) => setList(e.target.value)}>
        {LISTS.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>
      <input aria-label="Sent" type="number" value={sent} onChange={(e) => setSent(e.target.value)} />
      <input aria-label="Opens" type="number" value={opens} onChange={(e) => setOpens(e.target.value)} />
      <input aria-label="Clicks" type="number" value={clicks} onChange={(e) => setClicks(e.target.value)} />
      <button
        onClick={() => {
          addBlast(subject, list, sent, opens, clicks)
          setSubject('')
          setSent('')
          setOpens('')
          setClicks('')
        }}
      >
        Add blast
      </button>
      <ul>
        {visible.map((b) => (
          <li key={b.id}>
            {`${b.subject} — ${b.list}: ${b.sent} sent, ${b.opens} opens, ${b.clicks} clicks`}
          </li>
        ))}
      </ul>
    </section>
  )
}
