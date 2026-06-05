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
  return (
    <div data-testid="filters">
      <label htmlFor="env-filter">Environment</label>
      <select
        id="env-filter"
        data-testid="env-filter"
        value={envFilter}
        onChange={(e) => onEnvChange(e.target.value)}
      >
        <option value="all">All</option>
        {envs.map((env) => (
          <option key={env} value={env}>
            {env}
          </option>
        ))}
      </select>
    </div>
  )
}
