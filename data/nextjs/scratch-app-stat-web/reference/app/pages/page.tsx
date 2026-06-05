'use client'
import { useApp } from '../../components/AppStateProvider'
import { useMetrics } from '../../hooks/useMetrics'
import PageRow from '../../components/PageRow'

export default function PagesPage() {
  const { pages, selectedPageId, selectPage } = useApp()
  const { viewsFor } = useMetrics()
  const selected = pages.find((p) => p.id === selectedPageId)
  return (
    <section data-testid="page-pages">
      <h1>Pages</h1>
      <ul data-testid="page-list">
        {pages.map((p) => (
          <PageRow key={p.id} page={p} views={viewsFor(p)} onSelect={selectPage} />
        ))}
      </ul>
      {selected ? (
        <div data-testid="page-detail">
          <span data-testid="detail-path">{selected.path}</span>
          <span data-testid="detail-sessions">{selected.sessions}</span>
        </div>
      ) : null}
    </section>
  )
}
