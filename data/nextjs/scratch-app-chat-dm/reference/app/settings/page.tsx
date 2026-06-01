'use client'
import { useApp } from '../../components/AppStateProvider'
import { useInbox } from '../../hooks/useInbox'
import type { Theme } from '../../lib/types'

export default function SettingsPage() {
  const { theme, setTheme } = useApp()
  const { stats } = useInbox()

  return (
    <section data-testid="page-settings">
      <h1>Settings</h1>
      <label htmlFor="theme-select">Theme</label>
      <select
        id="theme-select"
        data-testid="theme-select"
        value={theme}
        onChange={(e) => setTheme(e.target.value as Theme)}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      <div data-testid="inbox-stats">
        <span data-testid="stat-threads">{stats.totalThreads}</span>
        <span data-testid="stat-unread">{stats.unreadThreads}</span>
        <span data-testid="stat-messages">{stats.totalMessages}</span>
      </div>
    </section>
  )
}
