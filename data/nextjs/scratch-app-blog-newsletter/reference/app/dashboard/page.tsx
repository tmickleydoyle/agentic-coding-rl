'use client'
import { useApp } from '../../components/AppStateProvider'
import { useNewsletter } from '../../hooks/useNewsletter'
import StatCard from '../../components/StatCard'

export default function DashboardPage() {
  const { theme, setTheme } = useApp()
  const { stats } = useNewsletter()
  return (
    <section data-testid="page-dashboard">
      <h1>Dashboard</h1>
      <div data-testid="stats">
        <StatCard label="Campaigns" value={stats.totalCampaigns} testid="campaigns" />
        <StatCard label="Sent" value={stats.sent} testid="sent" />
        <StatCard label="Drafts" value={stats.draft} testid="draft" />
        <StatCard label="Subscribers" value={stats.totalSubscribers} testid="subscribers" />
        <StatCard label="Active" value={stats.activeSubscribers} testid="active" />
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
