'use client'
import { useWater } from '../../components/WaterProvider'

export default function SettingsPage() {
  const { reminders, setReminders, theme, setTheme } = useWater()
  return (
    <section data-testid="page-settings">
      <h1>Settings</h1>
      <p data-testid="reminders-count">{reminders}</p>
      <button
        data-testid="reminders-inc"
        onClick={() => setReminders(reminders + 1)}
      >
        Add reminder
      </button>
      <button
        data-testid="reminders-dec"
        onClick={() => setReminders(Math.max(0, reminders - 1))}
      >
        Remove reminder
      </button>
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
