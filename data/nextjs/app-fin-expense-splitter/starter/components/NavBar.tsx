'use client'
import { useSplit } from './SplitProvider'

export default function NavBar() {
  // TODO: render a nav button per route (nav-dashboard/nav-expenses/nav-people/
  // nav-balances) that calls navigate(); the active route's button gets aria-current="page".
  const { navigate } = useSplit()
  void navigate
  return <nav data-testid="navbar" />
}
