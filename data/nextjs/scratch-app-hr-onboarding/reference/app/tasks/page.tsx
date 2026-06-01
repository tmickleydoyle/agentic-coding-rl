'use client'
import { useApp } from '../../components/AppStateProvider'

export default function TasksPage() {
  const { hires, tasks, toggleTask } = useApp()
  const hireName = (id: string): string => hires.find((h) => h.id === id)?.name ?? 'Unknown'
  const doneCount = tasks.filter((t) => t.done).length
  return (
    <section data-testid="page-tasks">
      <h1>Tasks</h1>
      <span data-testid="tasks-total">{tasks.length}</span>
      <span data-testid="tasks-done">{doneCount}</span>
      <ul data-testid="task-list">
        {tasks.map((t) => (
          <li key={t.id} data-testid={`row-task-${t.id}`} data-done={t.done ? 'true' : 'false'}>
            <span data-testid={`row-task-${t.id}-label`}>{t.label}</span>
            <span data-testid={`row-task-${t.id}-hire`}>{hireName(t.hireId)}</span>
            <button data-testid={`row-toggle-${t.id}`} onClick={() => toggleTask(t.id)}>
              Toggle
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
