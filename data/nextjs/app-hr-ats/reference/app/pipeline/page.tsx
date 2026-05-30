'use client'
import { useApp } from '../../components/AppStateProvider'
import { usePipeline } from '../../hooks/usePipeline'
import CandidateCard from '../../components/CandidateCard'
import { STAGES } from '../../lib/types'

export default function PipelinePage() {
  const { advanceStage } = useApp()
  const { byStage } = usePipeline()
  return (
    <section data-testid="page-pipeline">
      <h1>Pipeline</h1>
      {STAGES.map((s) => (
        <div key={s} data-testid={`column-${s}`}>
          <h2>{s}</h2>
          <span data-testid={`column-${s}-count`}>{byStage[s].length}</span>
          <ul data-testid={`column-${s}-list`}>
            {byStage[s].map((c) => (
              <CandidateCard
                key={c.id}
                candidate={c}
                canAdvance={c.stage !== 'hired'}
                onAdvance={advanceStage}
              />
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}
