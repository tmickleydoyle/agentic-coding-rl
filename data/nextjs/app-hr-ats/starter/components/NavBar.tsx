'use client'
import { useApp } from './AppStateProvider'

export default function NavBar() {
  // TODO: render a nav button per route (nav-jobs/nav-candidates/nav-pipeline/
  // nav-job-detail) that calls navigate(); the active route's button gets
  // aria-current="page".
  const { navigate } = useApp()
  void navigate
  return <nav data-testid="navbar" />
}
