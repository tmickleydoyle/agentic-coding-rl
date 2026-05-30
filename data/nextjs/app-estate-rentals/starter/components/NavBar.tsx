'use client'
import { useApp } from './AppStateProvider'

export default function NavBar() {
  // TODO: render a nav button per route (nav-units/nav-unit-detail/nav-applications/
  // nav-occupancy) that calls navigate(); the active route gets aria-current="page".
  const { navigate } = useApp()
  void navigate
  return <nav data-testid="navbar" />
}
