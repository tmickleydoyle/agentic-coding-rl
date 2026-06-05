'use client'
import { PlatformProvider } from '../components/PlatformProvider'
import { NavBar } from '../components/NavBar'
import { Features } from '../components/Features'
import { Bugs } from '../components/Bugs'
import { Quality } from '../components/Quality'
import { usePlatform } from '../hooks/usePlatform'

function Shell() {
  const { route } = usePlatform()
  return (
    <div>
      <NavBar />
      {route === 'features' && <Features />}
      {route === 'bugs' && <Bugs />}
      {route === 'quality' && <Quality />}
    </div>
  )
}

export default function App() {
  return (
    <PlatformProvider>
      <Shell />
    </PlatformProvider>
  )
}
