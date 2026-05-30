'use client'
import { AppStateProvider, useMortgage } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import PropertiesPage from './properties/page'
import CalculatorPage from './calculator/page'
import ComparePage from './compare/page'
import SavedPage from './saved/page'

function ActivePage() {
  const { route } = useMortgage()
  switch (route) {
    case 'properties':
      return <PropertiesPage />
    case 'calculator':
      return <CalculatorPage />
    case 'compare':
      return <ComparePage />
    case 'saved':
      return <SavedPage />
    default:
      return <PropertiesPage />
  }
}

function Shell() {
  const { theme } = useMortgage()
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
