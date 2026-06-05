'use client'
import { useApp } from '../../components/AppStateProvider'

export default function ProjectDetailPage() {
  const { projects, currentProjectId, toggleFeatured } = useApp()
  const current = projects.find((p) => p.id === currentProjectId)
  if (!current) {
    return (
      <section data-testid="page-project-detail">
        <p data-testid="no-project">No project selected.</p>
      </section>
    )
  }
  return (
    <section data-testid="page-project-detail">
      <h1 data-testid="detail-title">{current.title}</h1>
      <p data-testid="detail-tags">{current.tags.join(', ')}</p>
      <p data-testid="detail-featured">{current.featured ? 'Featured' : 'Not featured'}</p>
      <button
        data-testid="detail-feature-toggle"
        onClick={() => toggleFeatured(current.id)}
      >
        {current.featured ? 'Unfeature' : 'Feature'}
      </button>
    </section>
  )
}
