'use client'
import { useRoutine } from '../../components/RoutineProvider'
import { useWeek, WEEKDAYS } from '../../hooks/useWeek'

export default function WeekPlanPage() {
  const { today } = useRoutine()
  const { byDay, todaysRoutines } = useWeek()
  return (
    <section data-testid="page-week-plan">
      <h1>Week Plan</h1>
      <div data-testid="today-session" data-today={today}>
        <span data-testid="today-count">{todaysRoutines.length}</span>
        <ul data-testid="today-routines">
          {todaysRoutines.map((r) => (
            <li key={r.id} data-testid={`today-routine-${r.id}`}>
              {r.name}
            </li>
          ))}
        </ul>
      </div>
      <ul data-testid="week-list">
        {WEEKDAYS.map((d) => (
          <li key={d} data-testid={`day-${d}`}>
            <span data-testid={`day-${d}-count`}>{byDay[d].length}</span>
            <ul data-testid={`day-${d}-routines`}>
              {byDay[d].map((r) => (
                <li key={r.id} data-testid={`day-${d}-routine-${r.id}`}>
                  {r.name}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  )
}
