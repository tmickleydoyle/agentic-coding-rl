'use client'
import { useApp } from '../../components/AppStateProvider'
import { percentComplete, tasksForHire } from '../../hooks/useOnboarding'
import TaskItem from '../../components/TaskItem'

export default function HireDetailPage() {
  const { hires, tasks, selectedHireId, toggleTask } = useApp()
  const hire = hires.find((h) => h.id === selectedHireId)

  if (!hire) {
    return (
      <section data-testid="page-hire-detail">
        <p data-testid="no-hire">No hire selected.</p>
      </section>
    )
  }

  const hireTasks = tasksForHire(tasks, hire.id)

  return (
    <section data-testid="page-hire-detail">
      <h1 data-testid="detail-name">{hire.name}</h1>
      <span data-testid="detail-role">{hire.role}</span>
      <span data-testid="detail-percent">{percentComplete(tasks, hire.id)}</span>
      <ul data-testid="detail-tasks">
        {hireTasks.map((t) => (
          <TaskItem key={t.id} task={t} onToggle={toggleTask} />
        ))}
      </ul>
    </section>
  )
}
