'use client'
import { BoardProvider, useBoard } from '../components/BoardProvider'
import NavBar from '../components/NavBar'
import BoardPage from './board/page'
import AddCardPage from './add-card/page'
import ArchivePage from './archive/page'
import SettingsPage from './settings/page'

function ActivePage() {
  const { route } = useBoard()
  switch (route) {
    case 'board':
      return <BoardPage />
    case 'add-card':
      return <AddCardPage />
    case 'archive':
      return <ArchivePage />
    case 'settings':
      return <SettingsPage />
    default:
      return <BoardPage />
  }
}

function Shell() {
  const { theme } = useBoard()
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
    <BoardProvider>
      <Shell />
    </BoardProvider>
  )
}
