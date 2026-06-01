'use client'
import { useRoutine } from '../../components/RoutineProvider'
import RoutineCard from '../../components/RoutineCard'

export default function RoutinesPage() {
  const { routines, assignDay, removeRoutine } = useRoutine()
  return (
    <section data-testid="page-routines">
      <h1>Routines</h1>
      {routines.length === 0 ? (
        <p data-testid="empty-state">No routines yet.</p>
      ) : (
        <ul data-testid="routine-list">
          {routines.map((r) => (
            <RoutineCard
              key={r.id}
              routine={r}
              onAssign={assignDay}
              onRemove={removeRoutine}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
