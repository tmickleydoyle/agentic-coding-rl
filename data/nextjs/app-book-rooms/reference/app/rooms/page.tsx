'use client'
import { useApp } from '../../components/AppStateProvider'
import RoomCard from '../../components/RoomCard'

export default function RoomsPage() {
  const { rooms, selectRoom } = useApp()
  return (
    <section data-testid="page-rooms">
      <h1>Rooms</h1>
      <ul data-testid="rooms-list">
        {rooms.map((r) => (
          <RoomCard key={r.id} room={r} onSelect={selectRoom} />
        ))}
      </ul>
    </section>
  )
}
