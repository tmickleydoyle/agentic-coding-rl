'use client'
import { useApp } from '../../components/AppStateProvider'
import { useNotesView } from '../../hooks/useNotesView'

export default function SettingsPage() {
  const { theme, setTheme } = useApp()
  const { totalWords } = useNotesView()
  return (
    <section data-testid="page-settings">
      <h1>Settings</h1>
      <p data-testid="current-theme">{theme}</p>
      <button
        data-testid="theme-toggle"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        Switch to {theme === 'light' ? 'dark' : 'light'} mode
      </button>
      <p data-testid="total-words">{totalWords}</p>
    </section>
  )
}
