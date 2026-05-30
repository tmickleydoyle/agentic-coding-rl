'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import AuctionsPage from './auctions/page'
import DetailPage from './detail/page'
import MyBidsPage from './mybids/page'
import WonPage from './won/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'auctions':
      return <AuctionsPage />
    case 'detail':
      return <DetailPage />
    case 'mybids':
      return <MyBidsPage />
    case 'won':
      return <WonPage />
    default:
      return <AuctionsPage />
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
