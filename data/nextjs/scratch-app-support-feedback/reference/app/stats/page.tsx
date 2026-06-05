'use client'
import { useApp } from '../../components/AppStateProvider'
import { useFeedback, statusCount } from '../../hooks/useFeedback'

export default function StatsPage() {
  const { items, theme, setTheme } = useApp()
  const { sentiments } = useFeedback()
  return (
    <section data-testid="page-stats">
      <h1>Stats</h1>
      <div data-testid="sentiment-counts">
        <span data-testid="sentiment-positive">{sentiments.positive}</span>
        <span data-testid="sentiment-neutral">{sentiments.neutral}</span>
        <span data-testid="sentiment-negative">{sentiments.negative}</span>
      </div>
      <div data-testid="status-counts">
        <span data-testid="status-new">{statusCount(items, 'new')}</span>
        <span data-testid="status-reviewed">{statusCount(items, 'reviewed')}</span>
        <span data-testid="status-resolved">{statusCount(items, 'resolved')}</span>
      </div>
      <p data-testid="total-count">{items.length}</p>
      <div data-testid="theme-section">
        <p data-testid="current-theme">{theme}</p>
        <button data-testid="theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          Switch to {theme === 'light' ? 'dark' : 'light'} mode
        </button>
      </div>
    </section>
  )
}
