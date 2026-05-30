'use client'
import type { Scope } from '../lib/types'

export default function ScopeTag({ scope }: { scope: Scope }) {
  // TODO: render <span data-testid="tag" data-scope={scope}>
  void scope
  return <span data-testid="tag" />
}
