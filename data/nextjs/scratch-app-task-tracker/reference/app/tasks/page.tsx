'use client'
import { useApp } from '../../components/AppStateProvider'
import { useTasks } from '../../hooks/useTasks'
import Filters from '../../components/Filters'
import TaskItem from '../../components/TaskItem'

export default function TasksPage() {
  const {
    projects,
    statusFilter,
    projectFilter,
    setStatusFilter,
    setProjectFilter,
    toggleTask,
    removeTask,
  } = useApp()
  const { filtered } = useTasks()

  const projectName = (id: string): string =>
    projects.find((p) => p.id === id)?.name ?? 'Unknown'

  return (
    <section data-testid="page-tasks">
      <h1>Tasks</h1>
      <Filters
        projects={projects}
        statusFilter={statusFilter}
        projectFilter={projectFilter}
        onStatusChange={setStatusFilter}
        onProjectChange={setProjectFilter}
      />
      {filtered.length === 0 ? (
        <p data-testid="empty-state">No tasks match these filters.</p>
      ) : (
        <ul data-testid="task-list">
          {filtered.map((t) => (
            <TaskItem
              key={t.id}
              task={t}
              projectName={projectName(t.projectId)}
              onToggle={toggleTask}
              onRemove={removeTask}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
