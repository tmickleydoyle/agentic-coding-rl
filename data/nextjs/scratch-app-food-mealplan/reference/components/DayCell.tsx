'use client'
import type { Day } from '../lib/types'

export default function DayCell({
  day,
  count,
  onOpen,
}: {
  day: Day
  count: number
  onOpen: (day: Day) => void
}) {
  return (
    <div data-testid={`day-${day}`}>
      <span data-testid={`day-${day}-label`}>{day}</span>
      <span data-testid={`day-${day}-count`}>{count}</span>
      <button data-testid={`open-${day}`} onClick={() => onOpen(day)}>
        Open
      </button>
    </div>
  )
}
