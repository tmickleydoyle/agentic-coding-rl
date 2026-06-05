'use client'
import { useApp } from '../../components/AppStateProvider'
import { useComments } from '../../hooks/useComments'
import StatCard from '../../components/StatCard'

export default function SettingsPage() {
  const { theme, setTheme } = useApp()
  const { counts } = useComments()
  return (
    <section data-testid="page-settings">
      <h1>Settings</h1>
      <div data-testid="stats">
        <StatCard label="Total" value={counts.total} testid="total" />
        <StatCard label="Pending" value={counts.pending} testid="pending" />
        <StatCard label="Approved" value={counts.approved} testid="approved" />
        <StatCard label="Spam" value={counts.spam} testid="spam" />
      </div>
      <p data-testid="current-theme">{theme}</p>
      <button
        data-testid="theme-toggle"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        Switch to {theme === 'light' ? 'dark' : 'light'} mode
      </button>
    </section>
  )
}
