'use client'
import { useApp } from '../../components/AppStateProvider'
import { useSupport } from '../../hooks/useSupport'
import type { Theme } from '../../lib/types'

export default function HistoryPage() {
  const { chats, theme, setTheme } = useApp()
  const { stats } = useSupport()

  return (
    <section data-testid="page-history">
      <h1>History</h1>
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
      <div data-testid="support-stats">
        <span data-testid="stat-total">{stats.totalChats}</span>
        <span data-testid="stat-open">{stats.openChats}</span>
        <span data-testid="stat-closed">{stats.closedChats}</span>
      </div>
      <ul data-testid="history-list">
        {chats.map((c) => (
          <li key={c.id} data-testid={`history-${c.id}`}>
            <span data-testid={`history-${c.id}-customer`}>{c.customer}</span>
            <span data-testid={`history-${c.id}-status`}>{c.status}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
