'use client'
import { useState } from 'react'

type MenuItem = { name: string; price: number }
type OrderLine = { name: string; price: number; qty: number }

const MENU: MenuItem[] = [
  { name: 'Burger', price: 8.99 },
  { name: 'Pizza', price: 11.49 },
  { name: 'Salad', price: 6.49 },
  { name: 'Fries', price: 3.99 },
  { name: 'Soda', price: 1.99 },
]

function fmt(n: number): string {
  return `$${n.toFixed(2)}`
}

export default function App() {
  const [order, setOrder] = useState<OrderLine[]>([])
  const [confirmed, setConfirmed] = useState(false)

  function addItem(item: MenuItem) {
    setOrder((prev) => {
      const existing = prev.find((l) => l.name === item.name)
      if (existing) {
        return prev.map((l) => l.name === item.name ? { ...l, qty: l.qty + 1 } : l)
      }
      return [...prev, { name: item.name, price: item.price, qty: 1 }]
    })
    setConfirmed(false)
  }

  function removeItem(name: string) {
    setOrder((prev) => prev.filter((l) => l.name !== name))
  }

  function placeOrder() {
    if (order.length === 0) return
    setOrder([])
    setConfirmed(true)
  }

  const total = order.reduce((sum, l) => sum + l.price * l.qty, 0)

  return (
    <div>
      <h1>Restaurant Menu</h1>
      <section aria-label="Menu">
        <h2>Menu</h2>
        <ul>
          {MENU.map((item) => (
            <li key={item.name}>
              <span>{item.name}</span>
              <span>{fmt(item.price)}</span>
              <button onClick={() => addItem(item)}>Add to order</button>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Your Order">
        <h2>Your Order</h2>
        <ul>
          {order.map((line) => (
            <li key={line.name}>
              <span>{line.name}</span>
              <span>{`quantity: ${line.qty}`}</span>
              <span>{fmt(line.price * line.qty)}</span>
              <button onClick={() => removeItem(line.name)}>Remove</button>
            </li>
          ))}
        </ul>
        <p>{`Total: ${fmt(total)}`}</p>
        <button onClick={placeOrder}>Place Order</button>
        {confirmed && <p>Order placed! Thank you.</p>}
      </section>
    </div>
  )
}
