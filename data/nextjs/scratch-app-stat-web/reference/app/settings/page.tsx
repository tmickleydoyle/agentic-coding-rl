'use client'
import { useApp } from '../../components/AppStateProvider'
import type { DateRange } from '../../lib/types'

export default function SettingsPage() {
  const { theme, setTheme, range, setRange } = useApp()
  return (
    <section data-testid="page-settings">
      <h1>Settings</h1>
      <button
        data-testid="toggle-theme"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        Toggle theme
      </button>
      <span data-testid="current-theme">{theme}</span>
      <select
        data-testid="default-range"
        value={range}
        onChange={(e) => setRange(e.target.value as DateRange)}
      >
        <option value="7d">7d</option>
        <option value="30d">30d</option>
        <option value="all">All time</option>
      </select>
    </section>
  )
}
