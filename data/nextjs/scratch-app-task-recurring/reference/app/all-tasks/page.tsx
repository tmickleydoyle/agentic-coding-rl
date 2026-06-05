'use client'
import { useRecurring } from '../../components/RecurringProvider'
import TaskRow from '../../components/TaskRow'

export default function AllTasksPage() {
  const { tasks, today, removeTask } = useRecurring()
  return (
    <section data-testid="page-all-tasks">
      <h1>All tasks</h1>
      <ul data-testid="all-list">
        {tasks.map((t) => (
          <TaskRow
            key={t.id}
            task={t}
            due={t.nextDue <= today}
            onRemove={removeTask}
          />
        ))}
      </ul>
    </section>
  )
}
