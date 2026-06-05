'use client'
import { useApp } from '../../components/AppStateProvider'

function maxOf(values: number[]): number {
  let m = 0
  values.forEach((v) => {
    if (v > m) m = v
  })
  return m
}

export default function HistoryPage() {
  const { kpis, theme, setTheme, selectKpi } = useApp()
  return (
    <section data-testid="page-history">
      <h1>History</h1>
      <ul data-testid="history-list">
        {kpis.map((k) => (
          <li key={k.id} data-testid={`history-${k.id}`}>
            <button data-testid={`history-${k.id}-open`} onClick={() => selectKpi(k.id)}>
              {k.name}
            </button>
            <span data-testid={`history-${k.id}-points`}>{k.history.length}</span>
            <span data-testid={`history-${k.id}-max`}>{maxOf(k.history)}</span>
            <span data-testid={`history-${k.id}-latest`}>{k.history[k.history.length - 1]}</span>
          </li>
        ))}
      </ul>
      <div data-testid="theme-section">
        <p data-testid="current-theme">{theme}</p>
        <button data-testid="theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          Switch to {theme === 'light' ? 'dark' : 'light'} mode
        </button>
      </div>
    </section>
  )
}
