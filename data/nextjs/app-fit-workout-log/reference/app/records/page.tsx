'use client'
import { useWorkout } from '../../components/WorkoutProvider'
import { useStats } from '../../hooks/useStats'
import StatCard from '../../components/StatCard'

export default function RecordsPage() {
  const { exercises } = useWorkout()
  const { records, stats } = useStats()
  return (
    <section data-testid="page-records">
      <h1>Records</h1>
      <div data-testid="stats">
        <StatCard label="Workouts" value={stats.totalWorkouts} testid="workouts" />
        <StatCard label="Sets" value={stats.totalSets} testid="sets" />
        <StatCard label="Volume" value={stats.totalVolume} testid="volume" />
      </div>
      <ul data-testid="record-list">
        {exercises.map((ex) => (
          <li key={ex.id} data-testid={`record-${ex.id}`}>
            <span data-testid={`record-${ex.id}-name`}>{ex.name}</span>
            <span data-testid={`record-${ex.id}-value`}>{records[ex.id] ?? 0}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
