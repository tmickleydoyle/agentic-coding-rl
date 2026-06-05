'use client'
import { useDeployments } from '../../components/AppStateProvider'
import { useDeployStats } from '../../hooks/useDeployStats'
import Filters from '../../components/Filters'
import DeployRow from '../../components/DeployRow'

export default function DeploymentsPage() {
  const { theme, setTheme, envFilter, setEnvFilter, selectDeployment, rollback } = useDeployments()
  const { filtered, envs } = useDeployStats()

  return (
    <section data-testid="page-deployments">
      <h1>Deployments</h1>
      <p data-testid="current-theme">{theme}</p>
      <button
        data-testid="theme-toggle"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        Switch to {theme === 'light' ? 'dark' : 'light'} mode
      </button>
      <Filters envs={envs} envFilter={envFilter} onEnvChange={setEnvFilter} />
      {filtered.length === 0 ? (
        <p data-testid="empty-state">No deployments match this filter.</p>
      ) : (
        <ul data-testid="deploy-list">
          {filtered.map((d) => (
            <DeployRow
              key={d.id}
              deployment={d}
              onView={selectDeployment}
              onRollback={rollback}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
