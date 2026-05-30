'use client'
import { useApp } from './AppStateProvider'

export default function NavBar() {
  // TODO: render nav buttons (nav-dashboard/nav-targets/nav-history/nav-kpi-detail) that
  // call navigate(); the active route's button gets aria-current="page".
  const { navigate } = useApp()
  void navigate
  return <nav data-testid="navbar" />
}
