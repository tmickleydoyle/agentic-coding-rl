'use client'

export default function DayCell({
  day,
  count,
  onSelect,
}: {
  day: number
  count: number
  onSelect: (day: number) => void
}) {
  return (
    <button data-testid={`day-${day}`} onClick={() => onSelect(day)}>
      <span data-testid={`day-${day}-num`}>{day}</span>
      <span data-testid={`day-${day}-count`}>{count}</span>
    </button>
  )
}
