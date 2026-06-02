'use client'
import { StudioProvider } from '../components/StudioProvider'
import { NavBar } from '../components/NavBar'
import { Time } from '../components/Time'
import { Projects } from '../components/Projects'
import { Reports } from '../components/Reports'
import { useStudio } from '../hooks/useStudio'

function Shell() {
  const { route } = useStudio()
  return (
    <div>
      <NavBar />
      {route === 'time' && <Time />}
      {route === 'projects' && <Projects />}
      {route === 'reports' && <Reports />}
    </div>
  )
}

export default function App() {
  return (
    <StudioProvider>
      <Shell />
    </StudioProvider>
  )
}
