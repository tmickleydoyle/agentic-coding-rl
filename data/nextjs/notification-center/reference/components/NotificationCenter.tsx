'use client'
import { useState } from 'react'

type Note = { id: string; text: string }

export default function NotificationCenter({ notifications }: { notifications: Note[] }) {
  const [read, setRead] = useState<Set<string>>(new Set())
  const [openId, setOpenId] = useState<string | null>(null)
  const unread = notifications.length - read.size
  const open = (id: string) => {
    setRead((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      return next
    })
    setOpenId(id)
  }

  if (openId !== null) {
    const note = notifications.find((n) => n.id === openId)!
    return (
      <div>
        <p data-testid="reading">{note.text}</p>
        <button data-testid="back" onClick={() => setOpenId(null)}>Back</button>
      </div>
    )
  }

  return (
    <div>
      <ul data-testid="inbox">
        {notifications.map((n) => (
          <li key={n.id}>
            {n.text}
            <button data-testid={`open-${n.id}`} onClick={() => open(n.id)}>Open</button>
          </li>
        ))}
      </ul>
      <span data-testid="unread">{unread}</span>
    </div>
  )
}
