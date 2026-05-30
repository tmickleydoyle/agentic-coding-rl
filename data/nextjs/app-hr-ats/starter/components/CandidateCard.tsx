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
  // TODO: render <li data-testid="pipe-candidate-<id>"> with the name and an advance-<id>
  // button (disabled when !canAdvance) that advances the candidate.
  void canAdvance
  void onAdvance
  return <li data-testid={`pipe-candidate-${candidate.id}`} />
}
