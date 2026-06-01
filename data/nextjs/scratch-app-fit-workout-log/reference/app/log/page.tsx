'use client'
import { useState } from 'react'
import { useWorkout } from '../../components/WorkoutProvider'
import WorkoutRow from '../../components/WorkoutRow'

export default function LogPage() {
  const { workouts, exercises, addWorkout, removeWorkout, openWorkout } = useWorkout()
  const [name, setName] = useState('')
  const [date, setDate] = useState('2026-05-10')
  const [exerciseId, setExerciseId] = useState(exercises[0]?.id ?? '')
  const [reps, setReps] = useState('5')
  const [weight, setWeight] = useState('100')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim().length === 0) {
      setError('Name is required')
      return
    }
    setError('')
    addWorkout({
      name: name.trim(),
      date,
      exercises: [
        {
          exerciseId,
          sets: [{ reps: Number(reps) || 0, weight: Number(weight) || 0 }],
        },
      ],
    })
    setName('')
  }

  return (
    <section data-testid="page-log">
      <h1>Workout Log</h1>
      <form data-testid="log-form" onSubmit={onSubmit}>
        <input
          data-testid="name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="date"
          data-testid="date-input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <select
          data-testid="exercise-select"
          value={exerciseId}
          onChange={(e) => setExerciseId(e.target.value)}
        >
          {exercises.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.name}
            </option>
          ))}
        </select>
        <input
          data-testid="reps-input"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
        />
        <input
          data-testid="weight-input"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        {error ? <p data-testid="form-error">{error}</p> : null}
        <button type="submit" data-testid="submit-workout">
          Log workout
        </button>
      </form>
      {workouts.length === 0 ? (
        <p data-testid="empty-state">No workouts logged yet.</p>
      ) : (
        <ul data-testid="workout-list">
          {workouts.map((w) => (
            <WorkoutRow
              key={w.id}
              workout={w}
              onOpen={openWorkout}
              onRemove={removeWorkout}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
