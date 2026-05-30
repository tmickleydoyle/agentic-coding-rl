'use client'
import { useFlags } from '../../components/AppStateProvider'
import FlagRow from '../../components/FlagRow'

export default function FlagsPage() {
  const { flags, theme, setTheme, selectFlag } = useFlags()
  return (
    <section data-testid="page-flags">
      <h1>Feature flags</h1>
      <p data-testid="current-theme">{theme}</p>
      <button
        data-testid="theme-toggle"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        Switch to {theme === 'light' ? 'dark' : 'light'} mode
      </button>
      <ul data-testid="flag-list">
        {flags.map((f) => (
          <FlagRow key={f.id} flag={f} onView={selectFlag} />
        ))}
      </ul>
    </section>
  )
}
