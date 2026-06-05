'use client'
import { useApp } from '../../components/AppStateProvider'
import { STAGES } from '../../lib/types'

export default function CandidatesPage() {
  const { jobs, candidates, moveStage } = useApp()
  const jobTitle = (id: string): string => jobs.find((j) => j.id === id)?.title ?? 'Unknown'
  return (
    <section data-testid="page-candidates">
      <h1>Candidates</h1>
      <ul data-testid="candidate-list">
        {candidates.map((c) => (
          <li key={c.id} data-testid={`candidate-${c.id}`} data-stage={c.stage}>
            <span data-testid={`candidate-${c.id}-name`}>{c.name}</span>
            <span data-testid={`candidate-${c.id}-job`}>{jobTitle(c.jobId)}</span>
            <select
              data-testid={`stage-${c.id}`}
              value={c.stage}
              onChange={(e) => moveStage(c.id, e.target.value as (typeof STAGES)[number])}
            >
              {STAGES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </li>
        ))}
      </ul>
    </section>
  )
}
