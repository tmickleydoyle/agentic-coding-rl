'use client'
import { AccountsProvider, useAccounts } from '../components/AccountsProvider'
import NavBar from '../components/NavBar'
import AccountsPage from './accounts/page'
import AccountDetailPage from './account-detail/page'
import TransferPage from './transfer/page'
import SettingsPage from './settings/page'

function ActivePage() {
  const { route } = useAccounts()
  switch (route) {
    case 'accounts':
      return <AccountsPage />
    case 'account-detail':
      return <AccountDetailPage />
    case 'transfer':
      return <TransferPage />
    case 'settings':
      return <SettingsPage />
    default:
      return <AccountsPage />
  }
}

function Shell() {
  const { theme } = useAccounts()
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
    <AccountsProvider>
      <Shell />
    </AccountsProvider>
  )
}
