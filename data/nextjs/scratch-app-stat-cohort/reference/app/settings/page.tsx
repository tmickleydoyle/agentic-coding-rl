'use client'
import { useApp } from '../../components/AppStateProvider'
import type { SizeFilter } from '../../lib/types'

export default function SettingsPage() {
  const { theme, setTheme, sizeFilter, setSizeFilter } = useApp()
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
        data-testid="default-filter"
        value={sizeFilter}
        onChange={(e) => setSizeFilter(e.target.value as SizeFilter)}
      >
        <option value="all">All</option>
        <option value="large">Large</option>
      </select>
    </section>
  )
}
