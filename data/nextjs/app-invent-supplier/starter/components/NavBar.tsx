'use client'
import { useApp } from './AppStateProvider'

export default function NavBar() {
  // TODO: render nav buttons (nav-suppliers/nav-products/nav-add/nav-supplier-detail) that
  // call navigate(); the active route's button gets aria-current="page".
  const { navigate } = useApp()
  void navigate
  return <nav data-testid="navbar" />
}
