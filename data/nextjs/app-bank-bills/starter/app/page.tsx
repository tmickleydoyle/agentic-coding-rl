'use client'
import { BillsProvider, useBills } from '../components/BillsProvider'
import NavBar from '../components/NavBar'
import BillsPage from './bills/page'
import BillDetailPage from './bill-detail/page'
import AddPage from './add/page'
import UpcomingPage from './upcoming/page'

function ActivePage() {
  const { route } = useBills()
  switch (route) {
    case 'bills':
      return <BillsPage />
    case 'bill-detail':
      return <BillDetailPage />
    case 'add':
      return <AddPage />
    case 'upcoming':
      return <UpcomingPage />
    default:
      return <BillsPage />
  }
}

function Shell() {
  const { theme } = useBills()
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
    <BillsProvider>
      <Shell />
    </BillsProvider>
  )
}
