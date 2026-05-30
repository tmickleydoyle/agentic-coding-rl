'use client'
import { useApp } from '../../components/AppStateProvider'
import { useRooms } from '../../hooks/useRooms'
import type { Theme } from '../../lib/types'

export default function SettingsPage() {
  const { rooms, theme, setTheme, markRead } = useApp()
  const { stats } = useRooms()

  const markAllRead = () => {
    rooms.forEach((r) => markRead(r.id))
  }

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
      <button data-testid="mark-all-read" onClick={markAllRead}>
        Mark all read
      </button>
      <span data-testid="settings-unread">{stats.totalUnread}</span>
    </section>
  )
}
