'use client'
import { Provider } from '../components/Provider'
import { NavBar } from '../components/NavBar'
import { Items } from '../components/Items'
import { Check } from '../components/Check'
import { Summary } from '../components/Summary'
import { useApp } from '../hooks/useApp'

function Shell() {
  const { route } = useApp()
  return (
    <div>
      <NavBar />
      {route === 'items' && <Items />}
      {route === 'check' && <Check />}
      {route === 'summary' && <Summary />}
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
