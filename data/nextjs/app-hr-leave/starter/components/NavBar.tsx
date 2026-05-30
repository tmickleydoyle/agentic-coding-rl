'use client'
import { useApp } from './AppStateProvider'

export default function NavBar() {
  // TODO: render a nav button per route (nav-requests/nav-request-detail/nav-balances/
  // nav-calendar) that calls navigate(); the active route's button gets
  // aria-current="page".
  const { navigate } = useApp()
  void navigate
  return <nav data-testid="navbar" />
}
