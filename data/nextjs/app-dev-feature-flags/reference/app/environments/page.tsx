'use client'
import { useFlags } from '../../components/AppStateProvider'
import { envSummary } from '../../hooks/useFlagStats'
import { ENVS } from '../../lib/types'

export default function EnvironmentsPage() {
  const { flags } = useFlags()
  const summary = envSummary(flags)
  return (
    <section data-testid="page-environments">
      <h1>Environments</h1>
      <ul data-testid="env-summary">
        {ENVS.map((env) => (
          <li key={env} data-testid={`env-${env}`}>
            <span data-testid={`env-${env}-name`}>{env}</span>
            <span data-testid={`env-${env}-enabled`}>{summary[env]}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
