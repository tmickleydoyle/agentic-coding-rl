'use client'
import { useApp } from './AppStateProvider'
import { useStations } from '../hooks/useStations'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'stations', label: 'Stations' },
  { route: 'station-detail', label: 'Detail' },
  { route: 'favorites', label: 'Favorites' },
  { route: 'history', label: 'History' },
]

export default function NavBar() {
  const { route, navigate } = useApp()
  const { nowPlaying } = useStations()
  return (
    <nav data-testid="navbar">
      {ROUTES.map((r) => (
        <button
          key={r.route}
          data-testid={`nav-${r.route}`}
          aria-current={route === r.route ? 'page' : undefined}
          onClick={() => navigate(r.route)}
        >
          {r.label}
        </button>
      ))}
      <p data-testid="now-playing">
        {nowPlaying ? `Now playing: ${nowPlaying.name}` : 'Nothing playing'}
      </p>
    </nav>
  )
}
