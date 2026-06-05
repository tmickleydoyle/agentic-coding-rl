'use client'
import { useWarehouse } from '../../components/AppStateProvider'
import { useBins } from '../../hooks/useBins'
import { usagePct } from '../../lib/types'

export default function MapPage() {
  const { theme, setTheme, selectBin } = useWarehouse()
  const { bins, stats } = useBins()
  const overall = stats.capacity > 0 ? Math.round((stats.used / stats.capacity) * 100) : 0

  return (
    <section data-testid="page-map">
      <h1>Warehouse map</h1>
      <p data-testid="current-theme">{theme}</p>
      <button
        data-testid="theme-toggle"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        Switch to {theme === 'light' ? 'dark' : 'light'} mode
      </button>
      <p data-testid="overall-usage">
        {stats.used}/{stats.capacity} ({overall}%)
      </p>
      <p data-testid="bin-count">{stats.bins} bins</p>
      <ul data-testid="map-grid">
        {bins.map((b) => (
          <li
            key={b.id}
            data-testid={`cell-${b.id}`}
            data-usage={usagePct(b)}
            onClick={() => selectBin(b.id)}
          >
            {b.code}
          </li>
        ))}
      </ul>
    </section>
  )
}
