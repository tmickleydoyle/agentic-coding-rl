'use client'
import { useDeployments } from '../../components/AppStateProvider'
import { byEnv, environments } from '../../hooks/useDeployStats'

export default function EnvironmentsPage() {
  const { deployments } = useDeployments()
  const envs = environments(deployments)
  const counts = byEnv(deployments)
  return (
    <section data-testid="page-environments">
      <h1>Environments</h1>
      <ul data-testid="env-list">
        {envs.map((env) => (
          <li key={env} data-testid={`env-${env}`}>
            <span data-testid={`env-${env}-name`}>{env}</span>
            <span data-testid={`env-${env}-count`}>{counts[env] ?? 0}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
