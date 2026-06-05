'use client'
import { useApp } from '../../components/AppStateProvider'
import { useRoomSchedule } from '../../hooks/useRoomSchedule'

export default function SchedulePage() {
  const { rooms } = useApp()
  const { bookingsForRoom } = useRoomSchedule()

  return (
    <section data-testid="page-schedule">
      <h1>Schedule</h1>
      <ul data-testid="schedule-list">
        {rooms.map((room) => {
          const items = bookingsForRoom(room.id)
          return (
            <li key={room.id} data-testid={`room-schedule-${room.id}`}>
              <span data-testid={`room-schedule-${room.id}-name`}>{room.name}</span>
              <span data-testid={`room-schedule-${room.id}-count`}>{items.length}</span>
              <ul>
                {items.map((b) => (
                  <li key={b.id} data-testid={`booking-${b.id}`}>
                    <span>{b.title}</span>
                    <span>
                      {b.start}–{b.end}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
