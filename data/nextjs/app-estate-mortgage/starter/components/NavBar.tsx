'use client'
import { useMortgage } from './AppStateProvider'

export default function NavBar() {
  // TODO: render a nav button per route (nav-properties/nav-calculator/nav-compare/
  // nav-saved) that calls navigate(); the active route's button gets aria-current="page".
  const { navigate } = useMortgage()
  void navigate
  return <nav data-testid="navbar" />
}
