'use client'
import { AppStateProvider, useInvoices } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import DashboardPage from './dashboard/page'
import InvoicesPage from './invoices/page'
import ClientsPage from './clients/page'
import NewInvoicePage from './new-invoice/page'

function ActivePage() {
  const { route } = useInvoices()
  switch (route) {
    case 'dashboard':
      return <DashboardPage />
    case 'invoices':
      return <InvoicesPage />
    case 'clients':
      return <ClientsPage />
    case 'new-invoice':
      return <NewInvoicePage />
    default:
      return <DashboardPage />
  }
}

function Shell() {
  const { theme } = useInvoices()
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
