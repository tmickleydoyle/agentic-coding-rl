'use client'
import { useSavings } from './SavingsProvider'
import { potMet, potProgress } from '../hooks/useSavings'
import type { Pot } from '../lib/types'

export default function PotRow({ pot }: { pot: Pot }) {
  const { select } = useSavings()
  return (
    <li data-testid={`pot-${pot.id}`} data-met={potMet(pot) ? 'true' : 'false'}>
      <span data-testid={`pot-${pot.id}-name`}>{pot.name}</span>
      <span data-testid={`pot-${pot.id}-balance`}>{pot.balance}</span>
      <span data-testid={`pot-${pot.id}-goal`}>{pot.goal}</span>
      <span data-testid={`pot-${pot.id}-progress`}>{potProgress(pot)}</span>
      <button data-testid={`pot-${pot.id}-open`} onClick={() => select(pot.id)}>
        Open
      </button>
    </li>
  )
}
