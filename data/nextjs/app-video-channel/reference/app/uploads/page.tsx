'use client'
import { useApp } from '../../components/AppStateProvider'
import { sortVideos } from '../../hooks/useChannel'
import SortBar from '../../components/SortBar'

export default function UploadsPage() {
  const { videos, sort, viewsFor, setSort } = useApp()
  const sorted = sortVideos(videos, sort, viewsFor)

  return (
    <section data-testid="page-uploads">
      <h1>Uploads</h1>
      <SortBar sort={sort} onSort={setSort} />
      <ul data-testid="uploads-list">
        {sorted.map((v) => (
          <li key={v.id} data-testid={`up-${v.id}`}>
            <span data-testid={`up-${v.id}-title`}>{v.title}</span>
            <span data-testid={`up-${v.id}-views`}>{viewsFor(v.id)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
