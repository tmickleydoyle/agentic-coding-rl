'use client'
import type { Outcome } from '../lib/types'

export function statusText(result: Outcome): string {
  if (result === 'X') return 'X wins'
  if (result === 'O') return 'O wins'
  if (result === 'draw') return 'Draw'
  return 'Your turn'
}

export default function StatusBar({ result }: { result: Outcome }) {
  return <p data-testid="status">{statusText(result)}</p>
}
