'use client'
import { useBudget } from '../../components/BudgetProvider'
import type { Currency } from '../../lib/types'

const CURRENCIES: Currency[] = ['USD', 'EUR', 'GBP']

export default function SettingsPage() {
  const { theme, setTheme, currency, setCurrency } = useBudget()
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

      <label htmlFor="currency">Currency</label>
      <select
        id="currency"
        data-testid="currency-select"
        value={currency}
        onChange={(e) => setCurrency(e.target.value as Currency)}
      >
        {CURRENCIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </section>
  )
}
