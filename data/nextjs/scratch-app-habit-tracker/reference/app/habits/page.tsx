'use client'
import { useHabits } from '../../components/HabitProvider'
import { currentStreak } from '../../hooks/useHabitStats'

export default function HabitsPage() {
  const { habits, today, removeHabit } = useHabits()
  return (
    <section data-testid="page-habits">
      <h1>Habits</h1>
      {habits.length === 0 ? (
        <p data-testid="empty-state">No habits yet.</p>
      ) : (
        <ul data-testid="habit-manage-list">
          {habits.map((h) => (
            <li key={h.id} data-testid={`manage-${h.id}`}>
              <span data-testid={`manage-${h.id}-name`}>{h.name}</span>
              <span data-testid={`manage-${h.id}-streak`}>{currentStreak(h, today)}</span>
              <button data-testid={`delete-${h.id}`} onClick={() => removeHabit(h.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
