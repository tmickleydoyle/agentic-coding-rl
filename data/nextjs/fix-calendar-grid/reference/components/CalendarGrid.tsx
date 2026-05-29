'use client'

interface CalendarGridProps {
  year: number
  month: number // 1-based
}

function daysInMonth(year: number, month: number): number {
  // Day 0 of the next month is the last day of this month; handles leap years.
  return new Date(year, month, 0).getDate()
}

export default function CalendarGrid({ year, month }: CalendarGridProps) {
  // getDay() is already Sunday-based (0 = Sunday), which matches our column scheme.
  const leading = new Date(year, month - 1, 1).getDay()
  const total = daysInMonth(year, month)

  const cells: (number | null)[] = []
  for (let i = 0; i < leading; i++) cells.push(null)
  for (let d = 1; d <= total; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  const weeks: (number | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7))
  }

  return (
    <table>
      <tbody>
        {weeks.map((week, w) => (
          <tr key={w}>
            {week.map((day, wd) => (
              <td
                key={wd}
                data-testid={day !== null ? `cell-${w}-${wd}` : undefined}
              >
                {day ?? ''}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
