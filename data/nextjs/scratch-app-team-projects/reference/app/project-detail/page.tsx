'use client'
import { useApp } from '../../components/AppStateProvider'
import { tasksForProject } from '../../hooks/useBoard'

export default function ProjectDetailPage() {
  const { projects, members, tasks, selectedProjectId, reassignTask } = useApp()
  const project = projects.find((p) => p.id === selectedProjectId)

  if (!project) {
    return (
      <section data-testid="page-project-detail">
        <p data-testid="no-project">No project selected.</p>
      </section>
    )
  }

  const memberName = (id: string | null): string =>
    id ? members.find((m) => m.id === id)?.name ?? 'Unassigned' : 'Unassigned'

  const projectTasks = tasksForProject(tasks, project.id)

  return (
    <section data-testid="page-project-detail">
      <h1 data-testid="detail-name">{project.name}</h1>
      <ul data-testid="detail-tasks">
        {projectTasks.map((t) => (
          <li key={t.id} data-testid={`detail-task-${t.id}`} data-status={t.status}>
            <span data-testid={`detail-task-${t.id}-title`}>{t.title}</span>
            <span data-testid={`detail-task-${t.id}-assignee`}>{memberName(t.assigneeId)}</span>
            <select
              data-testid={`reassign-${t.id}`}
              value={t.assigneeId ?? 'unassigned'}
              onChange={(e) =>
                reassignTask(t.id, e.target.value === 'unassigned' ? null : e.target.value)
              }
            >
              <option value="unassigned">Unassigned</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </li>
        ))}
      </ul>
    </section>
  )
}
