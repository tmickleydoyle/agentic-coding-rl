'use client'
import { StockProvider } from '../components/StockProvider'
import { NavBar } from '../components/NavBar'
import { Inventory } from '../components/Inventory'
import { Restock } from '../components/Restock'
import { Report } from '../components/Report'
import { useStock } from '../hooks/useStock'

function Shell() {
  const { route } = useStock()
  return (
    <div>
      <NavBar />
      {route === 'inventory' && <Inventory />}
      {route === 'restock' && <Restock />}
      {route === 'report' && <Report />}
    </div>
  )
}

export default function App() {
  return (
    <StockProvider>
      <Shell />
    </StockProvider>
  )
}
