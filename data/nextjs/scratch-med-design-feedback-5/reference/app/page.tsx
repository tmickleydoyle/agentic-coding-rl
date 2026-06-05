'use client'
import { FeedbackProvider } from '../components/FeedbackProvider'
import { NavBar } from '../components/NavBar'
import { FeedbackView } from '../components/FeedbackView'
import { SummaryView } from '../components/SummaryView'
import { SettingsView } from '../components/SettingsView'
import { useApp } from '../hooks/useApp'

function Shell() {
  const { route, theme } = useApp()
  return (
    <div data-theme={theme}>
      <NavBar />
      {route === 'feedback' && <FeedbackView />}
      {route === 'summary' && <SummaryView />}
      {route === 'settings' && <SettingsView />}
    </div>
  )
}

export default function App() {
  return (
    <FeedbackProvider>
      <Shell />
    </FeedbackProvider>
  )
}
