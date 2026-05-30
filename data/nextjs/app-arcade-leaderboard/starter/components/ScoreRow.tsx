'use client'
import type { Score } from '../lib/types'

export default function ScoreRow({ score, rank }: { score: Score; rank: number }) {
  // TODO: render rank, player and points.
  void rank
  return <li data-testid={`score-${score.id}`} />
}
