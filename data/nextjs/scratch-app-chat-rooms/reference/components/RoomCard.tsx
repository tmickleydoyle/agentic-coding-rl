'use client'
import type { Room } from '../lib/types'

export default function RoomCard({
  room,
  unread,
  onOpen,
}: {
  room: Room
  unread: number
  onOpen: (id: string) => void
}) {
  return (
    <li data-testid={`room-${room.id}`}>
      <span data-testid={`room-${room.id}-name`}>{room.name}</span>
      <span data-testid={`room-${room.id}-topic`}>{room.topic}</span>
      <span data-testid={`room-${room.id}-unread`}>{unread}</span>
      <button data-testid={`open-${room.id}`} onClick={() => onOpen(room.id)}>
        Open
      </button>
    </li>
  )
}
