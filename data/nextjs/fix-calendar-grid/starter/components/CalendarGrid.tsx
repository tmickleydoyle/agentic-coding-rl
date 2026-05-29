'use client'

interface CalendarGridProps {
  year: number
  month: number // 1-based
}

// BUG: static table — February is always 28, so leap-year Feb loses its 29th day.
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

export default function CalendarGrid({ year, month }: CalendarGridProps) {
  // BUG: getDay() is already Sunday-based (0 = Sunday). Subtracting 1 to "convert"
  // shifts every date one column to the left (and breaks when the 1st is a Sunday).
  const leading = new Date(year, month - 1, 1).getDay() - 1
  const total = DAYS_IN_MONTH[month - 1]

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
