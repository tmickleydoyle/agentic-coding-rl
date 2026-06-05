'use client'
import { Provider } from '../components/Provider'
import { NavBar } from '../components/NavBar'
import { Menu } from '../components/Menu'
import { Orders } from '../components/Orders'
import { Revenue } from '../components/Revenue'
import { useApp } from '../hooks/useApp'

function Shell() {
  const { route } = useApp()
  return (
    <div>
      <NavBar />
      {route === 'menu' && <Menu />}
      {route === 'orders' && <Orders />}
      {route === 'revenue' && <Revenue />}
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
