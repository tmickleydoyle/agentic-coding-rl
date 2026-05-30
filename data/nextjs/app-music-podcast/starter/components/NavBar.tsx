'use client'
import { useApp } from './AppStateProvider'

export default function NavBar() {
  // TODO: render a nav button per route (nav-shows/nav-show-detail/nav-queue/
  // nav-subscriptions) that calls navigate(); the active route's button gets aria-current.
  const { navigate } = useApp()
  void navigate
  return <nav data-testid="navbar" />
}
