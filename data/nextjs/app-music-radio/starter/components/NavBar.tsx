'use client'
import { useApp } from './AppStateProvider'

export default function NavBar() {
  // TODO: render a nav button per route (nav-stations/nav-station-detail/nav-favorites/
  // nav-history) that calls navigate(); the active route's button gets aria-current. Also
  // render now-playing ("Now playing: <name>" or "Nothing playing").
  const { navigate } = useApp()
  void navigate
  return <nav data-testid="navbar" />
}
