'use client'
import type { Outcome } from '../lib/types'

export function statusText(_result: Outcome): string {
  // TODO: 'X wins' / 'O wins' / 'Draw' / 'Your turn'
  return ''
}

export default function StatusBar({ result }: { result: Outcome }) {
  // TODO: render the status text
  void result
  return <p data-testid="status" />
}
