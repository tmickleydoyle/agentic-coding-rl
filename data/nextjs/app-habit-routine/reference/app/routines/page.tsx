'use client'
import { useRoutine } from '../../components/RoutineProvider'
import { routineStreak } from '../../hooks/useRoutineStats'

export default function RoutinesPage() {
  const { routines, today, removeRoutine } = useRoutine()
  return (
    <section data-testid="page-routines">
      <h1>Routines</h1>
      {routines.length === 0 ? (
        <p data-testid="empty-state">No routines yet.</p>
      ) : (
        <ul data-testid="routine-manage-list">
          {routines.map((r) => (
            <li key={r.id} data-testid={`manage-${r.id}`}>
              <span data-testid={`manage-${r.id}-name`}>{r.name}</span>
              <span data-testid={`manage-${r.id}-kind`}>{r.kind}</span>
              <span data-testid={`manage-${r.id}-steps`}>{r.steps.length}</span>
              <span data-testid={`manage-${r.id}-streak`}>{routineStreak(r, today)}</span>
              <button data-testid={`delete-${r.id}`} onClick={() => removeRoutine(r.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
