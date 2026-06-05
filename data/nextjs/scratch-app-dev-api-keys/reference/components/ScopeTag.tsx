'use client'
import type { Scope } from '../lib/types'

export default function ScopeTag({ scope }: { scope: Scope }) {
  return (
    <span data-testid="tag" data-scope={scope}>
      {scope}
    </span>
  )
}
