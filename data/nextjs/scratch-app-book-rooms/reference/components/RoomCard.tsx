'use client'
import type { Room } from '../lib/types'

export default function RoomCard({
  room,
  onSelect,
}: {
  room: Room
  onSelect: (id: string) => void
}) {
  return (
    <li data-testid={`room-${room.id}`}>
      <span data-testid={`room-${room.id}-name`}>{room.name}</span>
      <span data-testid={`room-${room.id}-floor`}>{room.floor}</span>
      <button data-testid={`select-${room.id}`} onClick={() => onSelect(room.id)}>
        Select
      </button>
    </li>
  )
}
