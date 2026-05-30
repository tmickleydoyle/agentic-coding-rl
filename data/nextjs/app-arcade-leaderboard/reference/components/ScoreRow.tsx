'use client'
import type { Score } from '../lib/types'

export default function ScoreRow({ score, rank }: { score: Score; rank: number }) {
  return (
    <li data-testid={`score-${score.id}`}>
      <span data-testid={`score-${score.id}-rank`}>{rank}</span>
      <span data-testid={`score-${score.id}-player`}>{score.player}</span>
      <span data-testid={`score-${score.id}-points`}>{score.points}</span>
    </li>
  )
}
