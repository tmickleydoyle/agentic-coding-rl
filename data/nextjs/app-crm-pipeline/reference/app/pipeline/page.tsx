'use client'
import { useApp } from '../../components/AppStateProvider'
import { STAGES, dealsForStage, stageTotals } from '../../hooks/usePipeline'
import StageColumn from '../../components/StageColumn'
import type { Stage } from '../../lib/types'

const LABELS: Record<Stage, string> = {
  lead: 'Lead',
  qualified: 'Qualified',
  proposal: 'Proposal',
  won: 'Won',
  lost: 'Lost',
}

export default function PipelinePage() {
  const { deals, selectDeal } = useApp()
  const totals = stageTotals(deals)
  const totalByStage: Record<Stage, number> = {
    lead: 0,
    qualified: 0,
    proposal: 0,
    won: 0,
    lost: 0,
  }
  totals.forEach((t) => {
    totalByStage[t.stage] = t.value
  })
  return (
    <section data-testid="page-pipeline">
      <h1>Pipeline</h1>
      {STAGES.map((stage) => (
        <StageColumn
          key={stage}
          stage={stage}
          label={LABELS[stage]}
          deals={dealsForStage(deals, stage)}
          total={totalByStage[stage]}
          onOpen={selectDeal}
        />
      ))}
    </section>
  )
}
