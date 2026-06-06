'use client'
import { useState } from 'react'

const CATEGORIES = ['Documents', 'Electronics', 'Clothing', 'Toiletries', 'Other']

interface PackItem {
  id: number
  name: string
  category: string
  packed: boolean
}

const SEED: PackItem[] = [
  { id: 1, name: 'Passport', category: 'Documents', packed: false },
  { id: 2, name: 'Phone charger', category: 'Electronics', packed: false },
  { id: 3, name: 'T-shirts (3)', category: 'Clothing', packed: false },
  { id: 4, name: 'Toothbrush', category: 'Toiletries', packed: true },
  { id: 5, name: 'Sunscreen', category: 'Toiletries', packed: false },
  { id: 6, name: 'Laptop', category: 'Electronics', packed: true },
]

export default function App() {
  const [items, setItems] = useState<PackItem[]>(SEED.map(i => ({ ...i })))
  const [itemName, setItemName] = useState('')
  const [category, setCategory] = useState('Documents')
  const [catFilter, setCatFilter] = useState('All')
  const [showUnpacked, setShowUnpacked] = useState(false)
  const [nextId, setNextId] = useState(SEED.length + 1)

  const packedCount = items.filter(i => i.packed).length
  const totalCount = items.length

  let displayed = catFilter === 'All' ? items : items.filter(i => i.category === catFilter)
  if (showUnpacked) displayed = displayed.filter(i => !i.packed)

  function handleAdd() {
    if (!itemName.trim()) return
    setItems(prev => [...prev, { id: nextId, name: itemName.trim(), category, packed: false }])
    setNextId(n => n + 1)
    setItemName('')
    setCategory('Documents')
  }

  function handleToggle(id: number) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, packed: !i.packed } : i))
  }

  function handleRemove(id: number) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  return (
    <div>
      <h1>Travel Packing List</h1>
      <p data-testid="pack-progress">{packedCount} / {totalCount} packed</p>
      <label>
        Filter by category
        <select aria-label="Filter by category" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
          <option value="All">All</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>
      <button onClick={() => setShowUnpacked(false)}>Show All</button>
      <button onClick={() => setShowUnpacked(true)}>Show Unpacked</button>
      <ul>
        {displayed.map(item => (
          <li key={item.id} data-testid="packing-item">
            <input
              type="checkbox"
              aria-label={item.name}
              checked={item.packed}
              onChange={() => handleToggle(item.id)}
            />
            {item.name} | {item.category}
            <button data-testid="remove-item" onClick={() => handleRemove(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <div>
        <label>
          Item Name
          <input aria-label="Item Name" value={itemName} onChange={e => setItemName(e.target.value)} />
        </label>
        <label>
          Category
          <select aria-label="Category" value={category} onChange={e => setCategory(e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <button onClick={handleAdd}>Add Item</button>
      </div>
    </div>
  )
}
