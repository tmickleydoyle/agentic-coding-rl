'use client'
import { ShopProvider } from '../components/ShopProvider'
import { NavBar } from '../components/NavBar'
import { Products } from '../components/Products'
import { Sales } from '../components/Sales'
import { Report } from '../components/Report'
import { useShop } from '../hooks/useShop'

function Shell() {
  const { route } = useShop()
  return (
    <div>
      <NavBar />
      {route === 'products' && <Products />}
      {route === 'sales' && <Sales />}
      {route === 'report' && <Report />}
    </div>
  )
}

export default function App() {
  return (
    <ShopProvider>
      <Shell />
    </ShopProvider>
  )
}
