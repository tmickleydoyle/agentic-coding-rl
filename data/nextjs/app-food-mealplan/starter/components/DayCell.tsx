'use client'
import type { Day } from '../lib/types'

export default function DayCell(_props: {
  day: Day
  count: number
  onOpen: (day: Day) => void
}) {
  // TODO: render the day cell (label, meal count, open button).
  return <div data-testid={`day-${_props.day}`} />
}
