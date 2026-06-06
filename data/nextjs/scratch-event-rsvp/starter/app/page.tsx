'use client'
import { useState } from 'react'

export default function App() {
  const [_placeholder] = useState(null)
  return (
    <div>
      <h1>Event RSVP Manager</h1>
      <div>{/* implement event list here */}</div>
    </div>
  )
}
