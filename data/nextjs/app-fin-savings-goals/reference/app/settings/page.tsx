'use client'
import { useGoals } from '../../components/GoalsProvider'

export default function SettingsPage() {
  const { theme, setTheme } = useGoals()
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
    </section>
  )
}
