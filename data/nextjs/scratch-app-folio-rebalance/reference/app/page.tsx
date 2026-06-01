'use client'
import { RebalanceProvider, useRebalance } from '../components/RebalanceProvider'
import NavBar from '../components/NavBar'
import PortfolioPage from './portfolio/page'
import TargetsPage from './targets/page'
import RebalancePage from './rebalance/page'
import HistoryPage from './history/page'

function ActivePage() {
  const { route } = useRebalance()
  switch (route) {
    case 'portfolio':
      return <PortfolioPage />
    case 'targets':
      return <TargetsPage />
    case 'rebalance':
      return <RebalancePage />
    case 'history':
      return <HistoryPage />
    default:
      return <PortfolioPage />
  }
}

function Shell() {
  const { theme } = useRebalance()
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
    <RebalanceProvider>
      <Shell />
    </RebalanceProvider>
  )
}
