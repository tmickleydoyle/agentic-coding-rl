'use client'
import { useApp } from './AppStateProvider'

export default function NavBar() {
  // TODO: render nav buttons (nav-directory/nav-departments/nav-org/nav-profile) that call
  // navigate(); the active route's button gets aria-current="page".
  const { navigate } = useApp()
  void navigate
  return <nav data-testid="navbar" />
}
