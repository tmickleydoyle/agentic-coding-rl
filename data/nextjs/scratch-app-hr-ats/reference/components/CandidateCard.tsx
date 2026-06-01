'use client'
import type { Candidate } from '../lib/types'

export default function CandidateCard({
  candidate,
  canAdvance,
  onAdvance,
}: {
  candidate: Candidate
  canAdvance: boolean
  onAdvance: (id: string) => void
}) {
  return (
    <li data-testid={`pipe-candidate-${candidate.id}`}>
      <span data-testid={`pipe-candidate-${candidate.id}-name`}>{candidate.name}</span>
      <button
        data-testid={`advance-${candidate.id}`}
        disabled={!canAdvance}
        onClick={() => onAdvance(candidate.id)}
      >
        Advance
      </button>
    </li>
  )
}
