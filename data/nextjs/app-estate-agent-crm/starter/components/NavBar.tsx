'use client'
import { useCrm } from './AppStateProvider'

export default function NavBar() {
  // TODO: render a nav button per route (nav-leads/nav-properties/nav-pipeline) that calls
  // navigate(); the active route's button gets aria-current="page".
  const { navigate } = useCrm()
  void navigate
  return <nav data-testid="navbar" />
}
