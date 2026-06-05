'use client'
import { Provider } from '../components/Provider'
import { NavBar } from '../components/NavBar'
import { Queue } from '../components/Queue'
import { Board } from '../components/Board'
import { Stats } from '../components/Stats'
import { useApp } from '../hooks/useApp'

function Shell() {
  const { route } = useApp()
  return (
    <div>
      <NavBar />
      {route === 'queue' && <Queue />}
      {route === 'board' && <Board />}
      {route === 'stats' && <Stats />}
    </div>
  )
}

export default function App() {
  return (
    <Provider>
      <Shell />
    </Provider>
  )
}
