'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { useRooms } from '../../hooks/useRooms'
import MessageItem from '../../components/MessageItem'

export default function RoomPage() {
  const { rooms, members, selectedRoomId, sendMessage } = useApp()
  const { roomMessages } = useRooms()
  const [text, setText] = useState('')

  const room = rooms.find((r) => r.id === selectedRoomId)
  if (!room) {
    return (
      <section data-testid="page-room">
        <p data-testid="no-room-selected">No room selected.</p>
      </section>
    )
  }

  const handle = (id: string): string =>
    members.find((m) => m.id === id)?.handle ?? '@unknown'

  const msgs = roomMessages(room.id)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim().length === 0) return
    sendMessage(room.id, text)
    setText('')
  }

  return (
    <section data-testid="page-room">
      <h1 data-testid="room-title">{room.name}</h1>
      <ul data-testid="message-list">
        {msgs.map((m) => (
          <MessageItem key={m.id} message={m} authorHandle={handle(m.authorId)} />
        ))}
      </ul>
      <form data-testid="send-form" onSubmit={onSubmit}>
        <input
          data-testid="message-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" data-testid="send-submit">
          Send
        </button>
      </form>
    </section>
  )
}
