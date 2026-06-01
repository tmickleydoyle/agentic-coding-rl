'use client'
import { useRoutine } from '../../components/RoutineProvider'
import { completedToday, isComplete } from '../../hooks/useRoutineStats'
import RoutineCard from '../../components/RoutineCard'

export default function TodayPage() {
  const { routines, today, toggleStep } = useRoutine()
  const completed = routines.filter((r) => completedToday(r, today)).length

  return (
    <section data-testid="page-today">
      <h1>Today</h1>
      <p data-testid="today-date">{today}</p>
      <p data-testid="today-completed">{completed}</p>
      {routines.length === 0 ? (
        <p data-testid="empty-state">No routines yet.</p>
      ) : (
        <div data-testid="routine-board">
          {routines.map((r) => (
            <RoutineCard
              key={r.id}
              routine={r}
              complete={isComplete(r)}
              onToggle={toggleStep}
            />
          ))}
        </div>
      )}
    </section>
  )
}
