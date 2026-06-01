'use client'
import { useApp } from '../../components/AppStateProvider'
import { usePortfolio } from '../../hooks/usePortfolio'
import ProjectCard from '../../components/ProjectCard'

export default function ProjectsPage() {
  const { tagFilter, setTagFilter, toggleFeatured, selectProject, navigate } = useApp()
  const { allTags, visibleProjects } = usePortfolio()

  const open = (id: string) => {
    selectProject(id)
    navigate('project-detail')
  }

  return (
    <section data-testid="page-projects">
      <h1>Projects</h1>
      <label htmlFor="tag-filter">Tag</label>
      <select
        id="tag-filter"
        data-testid="tag-filter"
        value={tagFilter}
        onChange={(e) => setTagFilter(e.target.value)}
      >
        <option value="all">All tags</option>
        {allTags.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      {visibleProjects.length === 0 ? (
        <p data-testid="empty-state">No projects match this tag.</p>
      ) : (
        <ul data-testid="project-list">
          {visibleProjects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onToggleFeatured={toggleFeatured}
              onOpen={open}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
