'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import ClassesPage from './classes/page'
import ClassDetailPage from './class-detail/page'
import MyClassesPage from './my-classes/page'
import WaitlistPage from './waitlist/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'classes':
      return <ClassesPage />
    case 'class-detail':
      return <ClassDetailPage />
    case 'my-classes':
      return <MyClassesPage />
    case 'waitlist':
      return <WaitlistPage />
    default:
      return <ClassesPage />
  }
}

function Shell() {
  const { theme } = useApp()
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
    <AppStateProvider>
      <Shell />
    </AppStateProvider>
  )
}
