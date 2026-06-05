'use client'
import { useWorkout } from '../../components/WorkoutProvider'

export default function ExercisesPage() {
  const { exercises } = useWorkout()
  return (
    <section data-testid="page-exercises">
      <h1>Exercises</h1>
      <ul data-testid="exercise-list">
        {exercises.map((ex) => (
          <li key={ex.id} data-testid={`exercise-${ex.id}`}>
            <span data-testid={`exercise-${ex.id}-name`}>{ex.name}</span>
            <span data-testid={`exercise-${ex.id}-muscle`}>{ex.muscle}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
