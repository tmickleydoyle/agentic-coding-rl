'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import ContactsPage from './contacts/page'
import ContactDetailPage from './contact-detail/page'
import CompaniesPage from './companies/page'
import ActivityPage from './activity/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'contact-detail':
      return <ContactDetailPage />
    case 'companies':
      return <CompaniesPage />
    case 'activity':
      return <ActivityPage />
    default:
      return <ContactsPage />
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
