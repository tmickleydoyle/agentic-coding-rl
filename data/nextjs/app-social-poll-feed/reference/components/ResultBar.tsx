'use client'

export default function ResultBar({ optionId, pct }: { optionId: string; pct: number }) {
  return <span data-testid={`bar-${optionId}`}>{pct}%</span>
}
