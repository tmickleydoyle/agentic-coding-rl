'use client'
import { MatrixProvider, useMatrix } from '../components/MatrixProvider'
import NavBar from '../components/NavBar'
import MatrixPage from './matrix/page'
import AddPage from './add/page'
import FocusListPage from './focus-list/page'
import SettingsPage from './settings/page'

function ActivePage() {
  const { route } = useMatrix()
  switch (route) {
    case 'matrix':
      return <MatrixPage />
    case 'add':
      return <AddPage />
    case 'focus-list':
      return <FocusListPage />
    case 'settings':
      return <SettingsPage />
    default:
      return <MatrixPage />
  }
}

function Shell() {
  const { theme } = useMatrix()
  return (
    <div data-testid="app-root" data-theme={theme}>
      <NavBar />
      <main data-testid="page-content">
        <ActivePage />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <MatrixProvider>
      <Shell />
    </MatrixProvider>
  )
}
