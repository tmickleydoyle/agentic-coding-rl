'use client'
import { useApp } from './AppStateProvider'

export default function NavBar() {
  // TODO: render a nav button per route (nav-products/nav-orders/nav-add/nav-revenue) that
  // calls navigate(); the active route's button gets aria-current="page".
  const { navigate } = useApp()
  void navigate
  return <nav data-testid="navbar" />
}
