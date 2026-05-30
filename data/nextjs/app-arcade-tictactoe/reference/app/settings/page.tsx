'use client'
import { useApp } from '../../components/AppStateProvider'

export default function SettingsPage() {
  const { aiStarts, setAiStarts, theme, setTheme } = useApp()
  return (
    <section data-testid="page-settings">
      <h1>Settings</h1>
      <button
        data-testid="toggle-ai-starts"
        onClick={() => setAiStarts(!aiStarts)}
      >
        AI starts: {aiStarts ? 'on' : 'off'}
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
