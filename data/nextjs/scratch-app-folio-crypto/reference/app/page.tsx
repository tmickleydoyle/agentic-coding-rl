'use client'
import { PortfolioProvider, usePortfolio } from '../components/PortfolioProvider'
import NavBar from '../components/NavBar'
import PortfolioPage from './portfolio/page'
import CoinDetailPage from './coin-detail/page'
import AddPage from './add/page'
import AllocationPage from './allocation/page'

function ActivePage() {
  const { route } = usePortfolio()
  switch (route) {
    case 'portfolio':
      return <PortfolioPage />
    case 'coin-detail':
      return <CoinDetailPage />
    case 'add':
      return <AddPage />
    case 'allocation':
      return <AllocationPage />
    default:
      return <PortfolioPage />
  }
}

function Shell() {
  const { theme } = usePortfolio()
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
    <PortfolioProvider>
      <Shell />
    </PortfolioProvider>
  )
}
