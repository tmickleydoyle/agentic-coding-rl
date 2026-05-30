'use client'
import { useRecurring } from '../../components/RecurringProvider'
import { useDue } from '../../hooks/useDue'
import DueRow from '../../components/DueRow'

export default function TodayPage() {
  const { completeTask } = useRecurring()
  const { dueToday } = useDue()
  return (
    <section data-testid="page-today">
      <h1>Today</h1>
      <span data-testid="due-count">{dueToday.length}</span>
      {dueToday.length === 0 ? (
        <p data-testid="empty-today">Nothing due today.</p>
      ) : (
        <ul data-testid="due-list">
          {dueToday.map((t) => (
            <DueRow key={t.id} task={t} onComplete={completeTask} />
          ))}
        </ul>
      )}
    </section>
  )
}
