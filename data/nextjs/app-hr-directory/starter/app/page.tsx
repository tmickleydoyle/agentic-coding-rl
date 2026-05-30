'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import DirectoryPage from './directory/page'
import ProfilePage from './profile/page'
import DepartmentsPage from './departments/page'
import OrgPage from './org/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'profile':
      return <ProfilePage />
    case 'departments':
      return <DepartmentsPage />
    case 'org':
      return <OrgPage />
    default:
      return <DirectoryPage />
  }
}

function Shell() {
  // TODO: reflect theme as data-theme on app-root.
  return (
    <div data-testid="app-root">
      <NavBar />
      <main data-testid="page-content">
        <ActivePage />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AppStateProvider>
      <Shell />
    </AppStateProvider>
  )
}
