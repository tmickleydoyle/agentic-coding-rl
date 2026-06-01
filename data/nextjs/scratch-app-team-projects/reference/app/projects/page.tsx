'use client'
import { useApp } from '../../components/AppStateProvider'
import { tasksForProject } from '../../hooks/useBoard'
import ProjectRow from '../../components/ProjectRow'

export default function ProjectsPage() {
  const { projects, tasks, selectProject } = useApp()
  return (
    <section data-testid="page-projects">
      <h1>Projects</h1>
      <ul data-testid="project-list">
        {projects.map((p) => (
          <ProjectRow
            key={p.id}
            project={p}
            count={tasksForProject(tasks, p.id).length}
            onOpen={selectProject}
          />
        ))}
      </ul>
    </section>
  )
}
