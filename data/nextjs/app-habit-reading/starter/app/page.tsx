'use client'
import { ReadingProvider, useReading } from '../components/ReadingProvider'
import NavBar from '../components/NavBar'
import TodayPage from './today/page'
import BooksPage from './books/page'
import LogPage from './log/page'
import StatsPage from './stats/page'

function ActivePage() {
  const { route } = useReading()
  switch (route) {
    case 'today':
      return <TodayPage />
    case 'books':
      return <BooksPage />
    case 'log':
      return <LogPage />
    case 'stats':
      return <StatsPage />
    default:
      return <TodayPage />
  }
}

function Shell() {
  const { theme } = useReading()
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
    <ReadingProvider>
      <Shell />
    </ReadingProvider>
  )
}
