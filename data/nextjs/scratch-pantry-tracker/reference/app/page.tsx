'use client'
import { useState } from 'react'

type Category = 'Grains' | 'Oils' | 'Canned' | 'Condiments' | 'Other'

interface PantryItem {
  id: number
  name: string
  quantity: number
  unit: string
  category: Category
  expiryDate: string
  lowStock: boolean
}

const CATEGORIES: Category[] = ['Grains', 'Oils', 'Canned', 'Condiments', 'Other']

const SEED: PantryItem[] = [
  { id: 1, name: 'Rice', quantity: 2, unit: 'kg', category: 'Grains', expiryDate: '2026-12-01', lowStock: false },
  { id: 2, name: 'Olive Oil', quantity: 1, unit: 'bottle', category: 'Oils', expiryDate: '2026-08-15', lowStock: false },
  { id: 3, name: 'Canned Tomatoes', quantity: 3, unit: 'cans', category: 'Canned', expiryDate: '2027-01-10', lowStock: false },
  { id: 4, name: 'Flour', quantity: 0.5, unit: 'kg', category: 'Grains', expiryDate: '2026-07-01', lowStock: true },
  { id: 5, name: 'Honey', quantity: 1, unit: 'jar', category: 'Condiments', expiryDate: '2028-05-20', lowStock: false },
]

export default function App() {
  const [items, setItems] = useState<PantryItem[]>(SEED.map(i => ({ ...i })))
  const [itemName, setItemName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('')
  const [category, setCategory] = useState<Category>('Other')
  const [expiryDate, setExpiryDate] = useState('')
  const [filter, setFilter] = useState<'all' | 'low-stock'>('all')
  const [nextId, setNextId] = useState(6)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editQty, setEditQty] = useState('')

  const handleAdd = () => {
    if (!itemName.trim()) return
    const qty = Number(quantity)
    if (qty < 0) return
    if (!unit.trim()) return
    const newItem: PantryItem = {
      id: nextId,
      name: itemName.trim(),
      quantity: qty,
      unit: unit.trim(),
      category,
      expiryDate,
      lowStock: qty < 1,
    }
    setItems(prev => [...prev, newItem])
    setNextId(prev => prev + 1)
    setItemName('')
    setQuantity('')
    setUnit('')
    setExpiryDate('')
  }

  const handleDelete = (id: number) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const handleStartEdit = (item: PantryItem) => {
    setEditingId(item.id)
    setEditQty(String(item.quantity))
  }

  const handleSaveQty = (id: number) => {
    const qty = Number(editQty)
    setItems(prev => prev.map(i =>
      i.id === id ? { ...i, quantity: qty, lowStock: qty < 1 } : i
    ))
    setEditingId(null)
    setEditQty('')
  }

  const filtered = filter === 'all' ? items : items.filter(i => i.lowStock)
  const totalItemsCount = items.length
  const lowStockCount = items.filter(i => i.lowStock).length

  return (
    <div>
      <h1>Pantry Tracker</h1>

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
        <input
          type="date"
          data-testid="expiry-date-input"
          value={expiryDate}
          onChange={e => setExpiryDate(e.target.value)}
        />
        <button data-testid="add-item-btn" onClick={handleAdd}>Add Item</button>
      </div>

      <div>
        <span data-testid="total-items-count">{totalItemsCount}</span>
        <span data-testid="low-stock-count">{lowStockCount}</span>
      </div>

      <div>
        <button data-testid="filter-all" onClick={() => setFilter('all')}>All</button>
        <button data-testid="filter-low-stock" onClick={() => setFilter('low-stock')}>Low Stock</button>
      </div>

      <ul>
        {filtered.map(item => (
          <li key={item.id} data-testid={`item-card-${item.id}`}>
            <span data-testid={`item-name-${item.id}`}>{item.name}</span>
            <span data-testid={`item-quantity-${item.id}`}>{item.quantity} {item.unit}</span>
            <span data-testid={`item-category-${item.id}`}>{item.category}</span>
            <span data-testid={`item-expiry-${item.id}`}>{item.expiryDate}</span>
            {item.lowStock && (
              <span data-testid={`low-stock-badge-${item.id}`}>Low Stock</span>
            )}
            <button
              data-testid={`update-qty-btn-${item.id}`}
              onClick={() => handleStartEdit(item)}
            >
              Update Qty
            </button>
            {editingId === item.id && (
              <>
                <input
                  type="number"
                  data-testid={`qty-edit-input-${item.id}`}
                  value={editQty}
                  onChange={e => setEditQty(e.target.value)}
                />
                <button
                  data-testid={`save-qty-btn-${item.id}`}
                  onClick={() => handleSaveQty(item.id)}
                >
                  Save
                </button>
              </>
            )}
            <button data-testid={`delete-item-${item.id}`} onClick={() => handleDelete(item.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
