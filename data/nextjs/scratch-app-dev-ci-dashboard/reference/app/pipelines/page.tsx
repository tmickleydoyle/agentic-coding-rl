'use client'
import { useApp } from '../../components/AppStateProvider'

export default function PipelinesPage() {
  const { pipelines, selectPipeline } = useApp()
  return (
    <section data-testid="page-pipelines">
      <h1>Pipelines</h1>
      <ul data-testid="pipeline-list">
        {pipelines.map((p) => (
          <li key={p.id} data-testid={`pipeline-${p.id}`}>
            <span data-testid={`pipeline-${p.id}-name`}>{p.name}</span>
            <span data-testid={`pipeline-${p.id}-repo`}>{p.repo}</span>
            <button data-testid={`select-${p.id}`} onClick={() => selectPipeline(p.id)}>
              View
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
