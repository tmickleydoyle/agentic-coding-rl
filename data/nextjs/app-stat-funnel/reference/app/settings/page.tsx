'use client'
import { useApp } from '../../components/AppStateProvider'
import type { Segment } from '../../lib/types'

export default function SettingsPage() {
  const { theme, setTheme, segment, setSegment } = useApp()
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
        data-testid="default-segment"
        value={segment}
        onChange={(e) => setSegment(e.target.value as Segment)}
      >
        <option value="all">All</option>
        <option value="mobile">Mobile</option>
        <option value="desktop">Desktop</option>
      </select>
    </section>
  )
}
