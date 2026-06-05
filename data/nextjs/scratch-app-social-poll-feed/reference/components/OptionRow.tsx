'use client'
import type { Option } from '../lib/types'
import ResultBar from './ResultBar'

export default function OptionRow({
  option,
  pct,
  disabled,
  onVote,
}: {
  option: Option
  pct: number
  disabled: boolean
  onVote: (optionId: string) => void
}) {
  return (
    <li data-testid={`option-${option.id}`}>
      <span data-testid={`option-${option.id}-label`}>{option.label}</span>
      <span data-testid={`option-${option.id}-votes`}>{option.votes}</span>
      <span data-testid={`option-${option.id}-pct`}>{pct}</span>
      <ResultBar optionId={option.id} pct={pct} />
      <button
        data-testid={`vote-${option.id}`}
        disabled={disabled}
        onClick={() => onVote(option.id)}
      >
        Vote
      </button>
    </li>
  )
}
