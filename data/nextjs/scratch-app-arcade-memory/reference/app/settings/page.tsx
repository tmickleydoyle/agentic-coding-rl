'use client'
import { useApp } from '../../components/AppStateProvider'

export default function SettingsPage() {
  const { symbols, setSymbols, theme, setTheme } = useApp()
  return (
    <section data-testid="page-settings">
      <h1>Settings</h1>
      <span data-testid="pair-count">{symbols.length}</span>
      <button data-testid="set-easy" onClick={() => setSymbols(['A', 'B'])}>
        Easy
      </button>
      <button
        data-testid="set-hard"
        onClick={() => setSymbols(['A', 'B', 'C', 'D', 'E', 'F'])}
      >
        Hard
      </button>
      <button
        data-testid="toggle-theme"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        Theme: {theme}
      </button>
    </section>
  )
}
