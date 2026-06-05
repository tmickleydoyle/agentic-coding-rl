'use client'
import { useHabits } from '../../components/HabitProvider'
import { isDoneToday, completionRate } from '../../hooks/useHabitStats'
import HabitRow from '../../components/HabitRow'

export default function TodayPage() {
  const { habits, today, toggleToday } = useHabits()
  const done = habits.filter((h) => isDoneToday(h, today)).length
  const total = habits.length
  const percent = completionRate(habits, today)

  return (
    <section data-testid="page-today">
      <h1>Today</h1>
      <p data-testid="today-date">{today}</p>
      <p data-testid="today-done">{done}</p>
      <p data-testid="today-total">{total}</p>
      <p data-testid="today-percent">{percent}</p>
      {habits.length === 0 ? (
        <p data-testid="empty-state">No habits yet.</p>
      ) : (
        <ul data-testid="habit-list">
          {habits.map((h) => (
            <HabitRow
              key={h.id}
              habit={h}
              done={isDoneToday(h, today)}
              onToggle={toggleToday}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
