'use client'
import { useApp } from '../../components/AppStateProvider'
import RoomCard from '../../components/RoomCard'

export default function RoomsPage() {
  const { rooms, unread, openRoom } = useApp()
  return (
    <section data-testid="page-rooms">
      <h1>Rooms</h1>
      <ul data-testid="rooms-list">
        {rooms.map((r) => (
          <RoomCard key={r.id} room={r} unread={unread[r.id] ?? 0} onOpen={openRoom} />
        ))}
      </ul>
    </section>
  )
}
