'use client'
import { useApp } from './AppStateProvider'

export default function NavBar() {
  // TODO: render a nav button per route (nav-home/nav-projects/nav-writing/
  // nav-project-detail) that calls navigate(); the active route gets aria-current="page".
  const { navigate } = useApp()
  void navigate
  return <nav data-testid="navbar" />
}
