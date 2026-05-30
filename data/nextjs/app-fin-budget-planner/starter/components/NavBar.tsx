'use client'
import { useBudget } from './BudgetProvider'

export default function NavBar() {
  // TODO: render a nav button per route (nav-overview/nav-categories/nav-add-expense/
  // nav-settings) that calls navigate(); the active route's button gets aria-current="page".
  const { navigate } = useBudget()
  void navigate
  return <nav data-testid="navbar" />
}
