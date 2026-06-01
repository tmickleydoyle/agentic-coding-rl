'use client'
import { useApp } from '../../components/AppStateProvider'
import { useChannel } from '../../hooks/useChannel'
import type { Theme } from '../../lib/types'

export default function SettingsPage() {
  const { theme, setTheme } = useApp()
  const { stats } = useChannel()

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
      <div data-testid="channel-stats">
        <span data-testid="stat-messages">{stats.totalMessages}</span>
        <span data-testid="stat-open">{stats.openMessages}</span>
        <span data-testid="stat-replies">{stats.totalReplies}</span>
      </div>
    </section>
  )
}
