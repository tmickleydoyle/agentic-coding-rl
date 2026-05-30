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
  // TODO: render the room row with name/topic/unread and an open- button.
  void unread
  void onOpen
  return <li data-testid={`room-${room.id}`} />
}
