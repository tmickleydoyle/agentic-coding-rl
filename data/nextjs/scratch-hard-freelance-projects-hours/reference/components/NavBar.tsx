'use client'
import { useStudio } from '../hooks/useStudio'

export function NavBar() {
  const { navigate } = useStudio()
  return (
    <nav>
      <button onClick={() => navigate('time')}>Time</button>
      <button onClick={() => navigate('projects')}>Projects</button>
      <button onClick={() => navigate('reports')}>Reports</button>
    </nav>
  )
}
