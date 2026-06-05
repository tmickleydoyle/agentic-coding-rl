'use client'
import { useApp } from '../hooks/useApp'

export function SettingsView() {
  const { theme, toggleTheme, resetTasks, navigate } = useApp()
  return (
    <section aria-label="Settings view">
      <h1>Settings</h1>
      <button onClick={toggleTheme}>{`Toggle theme (current: ${theme})`}</button>
      <button
        onClick={() => {
          resetTasks()
          navigate('tasks')
        }}
      >
        Reset all tasks
      </button>
    </section>
  )
}
