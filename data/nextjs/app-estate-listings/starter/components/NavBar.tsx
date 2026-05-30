'use client'
import { useEstate } from './AppStateProvider'

export default function NavBar() {
  // TODO: render a nav button per route (nav-listings/nav-favorites/nav-filters) that
  // calls navigate(); the active route's button gets aria-current="page".
  const { navigate } = useEstate()
  void navigate
  return <nav data-testid="navbar" />
}
