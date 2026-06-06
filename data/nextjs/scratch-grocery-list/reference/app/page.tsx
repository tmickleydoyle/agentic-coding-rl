'use client'
import { useState } from 'react'

type Category = 'Dairy' | 'Bakery' | 'Produce' | 'Meat' | 'Other'

interface GroceryItem {
  id: number
  name: string
  quantity: number
  unit: string
  category: Category
  purchased: boolean
}

const CATEGORIES: Category[] = ['Dairy', 'Bakery', 'Produce', 'Meat', 'Other']

const SEED: GroceryItem[] = [
  { id: 1, name: 'Milk', quantity: 2, unit: 'liters', category: 'Dairy', purchased: false },
  { id: 2, name: 'Bread', quantity: 1, unit: 'loaf', category: 'Bakery', purchased: false },
  { id: 3, name: 'Apples', quantity: 6, unit: 'pcs', category: 'Produce', purchased: true },
  { id: 4, name: 'Chicken Breast', quantity: 500, unit: 'grams', category: 'Meat', purchased: false },
  { id: 5, name: 'Cheddar Cheese', quantity: 200, unit: 'grams', category: 'Dairy', purchased: false },
]

export default function App() {
  const [items, setItems] = useState<GroceryItem[]>(SEED.map(i => ({ ...i })))
  const [itemName, setItemName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('')
  const [category, setCategory] = useState<Category>('Other')
  const [filter, setFilter] = useState<'all' | Category>('all')
  const [nextId, setNextId] = useState(6)

  const handleAdd = () => {
    if (!itemName.trim()) return
    const qty = Number(quantity)
    if (qty <= 0) return
    const newItem: GroceryItem = {
      id: nextId,
      name: itemName.trim(),
      quantity: qty,
      unit: unit.trim() || 'pcs',
      category,
      purchased: false,
    }
    setItems(prev => [...prev, newItem])
    setNextId(prev => prev + 1)
    setItemName('')
    setQuantity('')
    setUnit('')
  }

  const handleDelete = (id: number) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const handleToggle = (id: number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, purchased: !i.purchased } : i))
  }

  const handleClearPurchased = () => {
    setItems(prev => prev.filter(i => !i.purchased))
  }

  const filtered = filter === 'all' ? items : items.filter(i => i.category === filter)
  const remainingCount = items.filter(i => !i.purchased).length
  const totalItemsCount = items.length

  return (
    <div>
      <h1>Grocery List</h1>

      <div>
        <input
          data-testid="item-name-input"
          value={itemName}
          onChange={e => setItemName(e.target.value)}
          placeholder="Item Name"
        />
        <input
          type="number"
          data-testid="quantity-input"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
          placeholder="Quantity"
        />
        <input
          data-testid="unit-input"
          value={unit}
          onChange={e => setUnit(e.target.value)}
          placeholder="Unit"
        />
        <select
          data-testid="category-select"
          value={category}
          onChange={e => setCategory(e.target.value as Category)}
        >
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button data-testid="add-item-btn" onClick={handleAdd}>Add Item</button>
      </div>

      <div>
        <span data-testid="remaining-count">{remainingCount}</span>
        <span data-testid="total-items-count">{totalItemsCount}</span>
      </div>

      <div>
        <button data-testid="filter-all" onClick={() => setFilter('all')}>All</button>
        {CATEGORIES.map(c => (
          <button
            key={c}
            data-testid={`filter-${c.toLowerCase()}`}
            onClick={() => setFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <button data-testid="clear-purchased-btn" onClick={handleClearPurchased}>
        Clear Purchased
      </button>

      <ul>
        {filtered.map(item => (
          <li key={item.id} data-testid={`item-card-${item.id}`}>
            <span
              data-testid={`item-name-${item.id}`}
              className={item.purchased ? 'line-through' : ''}
            >
              {item.name}
            </span>
            <span data-testid={`item-quantity-${item.id}`}>{item.quantity} {item.unit}</span>
            <span data-testid={`item-category-${item.id}`}>{item.category}</span>
            <input
              type="checkbox"
              data-testid={`item-checkbox-${item.id}`}
              checked={item.purchased}
              onChange={() => handleToggle(item.id)}
            />
            <button data-testid={`delete-item-${item.id}`} onClick={() => handleDelete(item.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
