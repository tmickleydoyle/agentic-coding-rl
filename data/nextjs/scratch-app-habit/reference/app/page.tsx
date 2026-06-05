'use client'
import { HabitProvider } from '../components/HabitProvider'
import { NavBar } from '../components/NavBar'
import { Today } from '../components/Today'
import { Weekly } from '../components/Weekly'
import { Stats } from '../components/Stats'
import { Settings } from '../components/Settings'
import { useHabits } from '../hooks/useHabits'

function Shell() {
  const { route, theme } = useHabits()
  return (
    <div data-theme={theme}>
      <NavBar />
      {route === 'today' && <Today />}
      {route === 'weekly' && <Weekly />}
      {route === 'stats' && <Stats />}
      {route === 'settings' && <Settings />}
    </div>
  )
}

export default function App() {
  return (
    <HabitProvider>
      <Shell />
    </HabitProvider>
  )
}
