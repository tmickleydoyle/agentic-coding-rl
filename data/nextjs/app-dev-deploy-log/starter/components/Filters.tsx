'use client'
import type { EnvFilter } from '../lib/types'

export default function Filters({
  envs,
  envFilter,
  onEnvChange,
}: {
  envs: string[]
  envFilter: EnvFilter
  onEnvChange: (filter: EnvFilter) => void
}) {
  // TODO: render an env-filter <select> (all + one option per env)
  void envs
  void envFilter
  void onEnvChange
  return <div data-testid="filters" />
}
