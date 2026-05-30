'use client'
import { useCrm } from '../../components/AppStateProvider'
import { usePipeline } from '../../hooks/usePipeline'

export default function PipelinePage() {
  const { theme, setTheme } = useCrm()
  const { stages, counts } = usePipeline()

  return (
    <section data-testid="page-pipeline">
      <h1>Pipeline</h1>
      <ul data-testid="pipeline">
        {stages.map((stage) => (
          <li key={stage.status} data-testid={`stage-${stage.status}`}>
            <span data-testid={`stage-${stage.status}-count`}>{counts[stage.status]}</span>
            <ul data-testid={`stage-${stage.status}-list`}>
              {stage.leads.map((l) => (
                <li key={l.id} data-testid={`stage-${stage.status}-lead-${l.id}`}>
                  {l.name}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <p data-testid="current-theme">{theme}</p>
      <button
        data-testid="theme-toggle"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        Switch theme
      </button>
    </section>
  )
}
