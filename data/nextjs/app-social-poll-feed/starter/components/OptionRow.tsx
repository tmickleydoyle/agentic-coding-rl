'use client'
import type { Option } from '../lib/types'

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
  // TODO: render label/votes/pct, a ResultBar and a vote-<id> button (disabled when voted).
  void pct
  void disabled
  void onVote
  return <li data-testid={`option-${option.id}`} />
}
