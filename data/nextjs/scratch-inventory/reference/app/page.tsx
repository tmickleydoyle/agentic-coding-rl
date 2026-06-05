'use client'
import { useState } from 'react'

type Item = {
  id: number
  name: string
  price: number
  stock: number
  threshold: number
}

const INITIAL_ITEMS: Item[] = [
  { id: 1, name: 'Widget A',    price: 5.00,  stock: 10, threshold: 5 },
  { id: 2, name: 'Gadget B',    price: 12.50, stock: 3,  threshold: 5 },
  { id: 3, name: 'Doohickey C', price: 8.75,  stock: 7,  threshold: 5 },
]

export default function App() {
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS)
  const [nextId, setNextId] = useState(4)
  const [nameInput, setNameInput] = useState('')
  const [priceInput, setPriceInput] = useState('')
  const [stockInput, setStockInput] = useState('')

  function addItem() {
    const name = nameInput.trim()
    const price = parseFloat(priceInput)
    const stock = parseInt(stockInput, 10)
    if (!name || isNaN(price) || price <= 0 || isNaN(stock) || stock < 0) return
    setItems(prev => [...prev, { id: nextId, name, price, stock, threshold: 5 }])
    setNextId(n => n + 1)
    setNameInput('')
    setPriceInput('')
    setStockInput('')
  }

  function changeStock(id: number, delta: number) {
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, stock: Math.max(0, item.stock + delta) }
          : item
      )
    )
  }

  const totalItems = items.length
  const totalValue = items.reduce((sum, item) => sum + item.price * item.stock, 0)

  return (
    <div>
      <h1>Inventory Tracker</h1>

      <div>
        <input
          aria-label="Item name"
          placeholder="Item name"
          value={nameInput}
          onChange={e => setNameInput(e.target.value)}
        />
        <input
          aria-label="Price"
          placeholder="Price"
          type="number"
          value={priceInput}
          onChange={e => setPriceInput(e.target.value)}
        />
        <input
          aria-label="Stock"
          placeholder="Stock"
          type="number"
          value={stockInput}
          onChange={e => setStockInput(e.target.value)}
        />
        <button onClick={addItem}>Add item</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>
                {item.name}
                {item.stock < item.threshold && <span> Low stock</span>}
              </td>
              <td>{item.stock}</td>
              <td>
                <button onClick={() => changeStock(item.id, 1)}>Increase</button>
                <button onClick={() => changeStock(item.id, -1)} disabled={item.stock === 0}>Decrease</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>{`Total items: ${totalItems}`}</div>
      <div>{`Total value: $${totalValue.toFixed(2)}`}</div>
    </div>
  )
}
