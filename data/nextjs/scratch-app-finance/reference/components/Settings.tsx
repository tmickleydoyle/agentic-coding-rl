'use client'
import { useFinance } from '../hooks/useFinance'

export function Settings() {
  const { theme, toggleTheme, expensesOnly, toggleExpensesOnly } = useFinance()
  return (
    <section aria-label="Settings view">
      <h1>Settings</h1>
      <button onClick={toggleTheme}>{`Toggle theme (current: ${theme})`}</button>
      <label>
        <input
          type="checkbox"
          aria-label="Show expenses only"
          checked={expensesOnly}
          onChange={toggleExpensesOnly}
        />
        Show expenses only
      </label>
    </section>
  )
}
