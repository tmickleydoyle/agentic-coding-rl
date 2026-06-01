'use client'
import { useApp } from '../../components/AppStateProvider'
import BuildRow from '../../components/BuildRow'

export default function PipelineDetailPage() {
  const { pipelines, builds, selectedPipelineId, retryBuild } = useApp()

  if (!selectedPipelineId) {
    return (
      <section data-testid="page-pipeline-detail">
        <p data-testid="no-selection">No pipeline selected.</p>
      </section>
    )
  }

  const pipeline = pipelines.find((p) => p.id === selectedPipelineId)
  const pipelineBuilds = builds.filter((b) => b.pipelineId === selectedPipelineId)

  return (
    <section data-testid="page-pipeline-detail">
      <h1 data-testid="detail-name">{pipeline?.name ?? 'Unknown'}</h1>
      <ul data-testid="build-list">
        {pipelineBuilds.map((b) => (
          <BuildRow key={b.id} build={b} onRetry={retryBuild} />
        ))}
      </ul>
    </section>
  )
}
