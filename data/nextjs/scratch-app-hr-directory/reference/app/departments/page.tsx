'use client'
import { useApp } from '../../components/AppStateProvider'
import { useDirectory } from '../../hooks/useDirectory'

export default function DepartmentsPage() {
  const { theme, setTheme } = useApp()
  const { departments } = useDirectory()
  return (
    <section data-testid="page-departments">
      <h1>Departments</h1>
      <ul data-testid="dept-list">
        {departments.map((d) => (
          <li key={d.department} data-testid={`dept-${d.department}`}>
            <span data-testid={`dept-${d.department}-name`}>{d.department}</span>
            <span data-testid={`dept-${d.department}-count`}>{d.count}</span>
          </li>
        ))}
      </ul>
      <div data-testid="theme-section">
        <p data-testid="current-theme">{theme}</p>
        <button data-testid="theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          Switch to {theme === 'light' ? 'dark' : 'light'} mode
        </button>
      </div>
    </section>
  )
}
