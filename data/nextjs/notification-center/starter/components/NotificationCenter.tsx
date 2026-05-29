'use client'
import { useState } from 'react'

type Note = { id: string; text: string }

export default function NotificationCenter({ notifications }: { notifications: Note[] }) {
  // TODO: track read Set + currently-open id; inbox/reader mutually exclusive;
  // unread count = notifications.length - read.size.
  return (
    <div>
      <ul data-testid="inbox">
        {notifications.map((n) => (
          <li key={n.id}>
            {n.text}
            <button data-testid={`open-${n.id}`}>Open</button>
          </li>
        ))}
      </ul>
      <span data-testid="unread">{notifications.length}</span>
    </div>
  )
}
