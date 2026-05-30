'use client'
import { useWorkout } from '../../components/WorkoutProvider'
import { useStats } from '../../hooks/useStats'

export default function WorkoutDetailPage() {
  const { workouts, selectedWorkoutId, navigate } = useWorkout()
  const { exerciseById } = useStats()
  const workout = workouts.find((w) => w.id === selectedWorkoutId)

  if (!workout) {
    return (
      <section data-testid="page-workout-detail">
        <h1>Workout Detail</h1>
        <p data-testid="no-selection">No workout selected.</p>
        <button data-testid="back-to-log" onClick={() => navigate('log')}>
          Back to log
        </button>
      </section>
    )
  }

  return (
    <section data-testid="page-workout-detail">
      <h1>Workout Detail</h1>
      <p data-testid="detail-name">{workout.name}</p>
      <p data-testid="detail-date">{workout.date}</p>
      <ul data-testid="detail-exercises">
        {workout.exercises.map((le) => {
          const ex = exerciseById(le.exerciseId)
          return (
            <li key={le.exerciseId} data-testid={`detail-exercise-${le.exerciseId}`}>
              <span data-testid={`detail-exercise-${le.exerciseId}-name`}>
                {ex?.name ?? 'Unknown'}
              </span>
              <span data-testid={`detail-exercise-${le.exerciseId}-sets`}>
                {le.sets.length}
              </span>
            </li>
          )
        })}
      </ul>
      <button data-testid="back-to-log" onClick={() => navigate('log')}>
        Back to log
      </button>
    </section>
  )
}
