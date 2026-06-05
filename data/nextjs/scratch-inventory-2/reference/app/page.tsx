'use client'
import { useState } from 'react'

type Item = { id: number; name: string; stock: number; price: number }

const INITIAL: Item[] = [
  { id: 1, name: 'Apples', stock: 10, price: 0.5 },
  { id: 2, name: 'Bananas', stock: 3, price: 0.25 },
  { id: 3, name: 'Cherries', stock: 50, price: 2.0 },
]

export default function App() {
  const [items, setItems] = useState<Item[]>(INITIAL)
  const [nextId, setNextId] = useState(4)
  const [nameInput, setNameInput] = useState('')
  const [stockInput, setStockInput] = useState('')
  const [priceInput, setPriceInput] = useState('')

  function addItem() {
    const name = nameInput.trim()
    const stock = Number(stockInput)
    const price = Number(priceInput)
    if (!name || stock < 0 || price < 0 || stockInput === '' || priceInput === '') return
    setItems((prev) => [...prev, { id: nextId, name, stock, price }])
    setNextId((n) => n + 1)
    setNameInput('')
    setStockInput('')
    setPriceInput('')
  }

  function increment(id: number) {
    setItems((prev) => prev.map((it) => it.id === id ? { ...it, stock: it.stock + 1 } : it))
  }

  function decrement(id: number) {
    setItems((prev) => prev.map((it) => it.id === id ? { ...it, stock: Math.max(0, it.stock - 1) } : it))
  }

  const totalValue = items.reduce((sum, it) => sum + it.stock * it.price, 0)

  return (
    <div>
      <h1>Inventory Tracker</h1>
      <div>
        <input
          aria-label="Item name"
          placeholder="Item name"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />
        <input
          aria-label="Stock"
          placeholder="Stock"
          type="number"
          value={stockInput}
          onChange={(e) => setStockInput(e.target.value)}
        />
        <input
          aria-label="Price ($)"
          placeholder="Price ($)"
          type="number"
          value={priceInput}
          onChange={(e) => setPriceInput(e.target.value)}
        />
        <button onClick={addItem}>Add item</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Stock</th>
            <th>Price</th>
            <th>Value</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => {
            const value = it.stock * it.price
            const isLow = it.stock <= 5
            return (
              <tr key={it.id} aria-label={it.name}>
                <td>{it.name}</td>
                <td>{it.stock}</td>
                <td>{`$${it.price.toFixed(2)}`}</td>
                <td>{`$${value.toFixed(2)}`}</td>
                <td>{isLow ? 'Low stock' : ''}</td>
                <td>
                  <button onClick={() => increment(it.id)}>+</button>
                  <button onClick={() => decrement(it.id)} disabled={it.stock === 0}>−</button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p>{`Total inventory value: $${totalValue.toFixed(2)}`}</p>
    </div>
  )
}
