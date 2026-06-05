'use client'
import { ItineraryProvider, useItinerary } from '../components/ItineraryProvider'
import NavBar from '../components/NavBar'
import TripsPage from './trips/page'
import TripDetailPage from './trip-detail/page'
import AddActivityPage from './add-activity/page'
import BudgetPage from './budget/page'

function ActivePage() {
  const { route } = useItinerary()
  switch (route) {
    case 'trips':
      return <TripsPage />
    case 'trip-detail':
      return <TripDetailPage />
    case 'add-activity':
      return <AddActivityPage />
    case 'budget':
      return <BudgetPage />
    default:
      return <TripsPage />
  }
}

function Shell() {
  const { theme } = useItinerary()
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
    <ItineraryProvider>
      <Shell />
    </ItineraryProvider>
  )
}
