'use client'
import { useSubs } from './SubsProvider'

export default function NavBar() {
  // TODO: render a nav button per route (nav-dashboard/nav-subscriptions/nav-add/
  // nav-upcoming) that calls navigate(); the active route's button gets aria-current="page".
  const { navigate } = useSubs()
  void navigate
  return <nav data-testid="navbar" />
}
