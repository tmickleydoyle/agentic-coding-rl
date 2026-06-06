'use client'
import { useState } from 'react'

interface Supply {
  id: number
  name: string
  category: string
  quantity: number
  reorderAt: number
  unit: string
}

const SEED: Supply[] = [
  { id: 1, name: 'Titanium White', category: 'Paint', quantity: 3, reorderAt: 2, unit: 'tubes' },
  { id: 2, name: 'Cadmium Red', category: 'Paint', quantity: 1, reorderAt: 3, unit: 'tubes' },
  { id: 3, name: 'Flat Brush Set', category: 'Brushes', quantity: 8, reorderAt: 2, unit: 'pieces' },
  { id: 4, name: 'Linen Canvas 12x16', category: 'Canvas', quantity: 2, reorderAt: 5, unit: 'pieces' },
  { id: 5, name: 'Palette Knife', category: 'Tools', quantity: 6, reorderAt: 1, unit: 'pieces' },
]

export default function App() {
  const [supplies, setSupplies] = useState<Supply[]>(SEED.map(x => ({ ...x })))
  const [filterText, setFilterText] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')

  const [inputName, setInputName] = useState('')
  const [inputCategory, setInputCategory] = useState('')
  const [inputQuantity, setInputQuantity] = useState('')
  const [inputReorderAt, setInputReorderAt] = useState('')
  const [inputUnit, setInputUnit] = useState('')
  const [formError, setFormError] = useState(false)

  const nextId = () => Math.max(0, ...supplies.map(s => s.id)) + 1

  const categories = Array.from(new Set(supplies.map(s => s.category)))

  const filtered = supplies.filter(s => {
    const matchText = s.name.toLowerCase().includes(filterText.toLowerCase())
    const matchCat = filterCategory === 'All' ? true : s.category === filterCategory
    return matchText && matchCat
  })

  const lowStockCount = supplies.filter(s => s.quantity <= s.reorderAt).length

  const handleIncrement = (id: number) => {
    setSupplies(prev => prev.map(s => s.id === id ? { ...s, quantity: s.quantity + 1 } : s))
  }

  const handleDecrement = (id: number) => {
    setSupplies(prev => prev.map(s => s.id === id ? { ...s, quantity: Math.max(0, s.quantity - 1) } : s))
  }

  const handleDelete = (id: number) => {
    setSupplies(prev => prev.filter(s => s.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const quantity = parseInt(inputQuantity, 10)
    const reorderAt = parseInt(inputReorderAt, 10)
    if (!inputName.trim() || !inputCategory.trim() || isNaN(quantity) || quantity < 0 || isNaN(reorderAt) || reorderAt < 0) {
      setFormError(true)
      return
    }
    setFormError(false)
    const newSupply: Supply = {
      id: nextId(),
      name: inputName.trim(),
      category: inputCategory.trim(),
      quantity,
      reorderAt,
      unit: inputUnit.trim() || 'pieces',
    }
    setSupplies(prev => [...prev, newSupply])
    setInputName('')
    setInputCategory('')
    setInputQuantity('')
    setInputReorderAt('')
    setInputUnit('')
  }

  return (
    <div>
      <h1>Supplies Inventory</h1>
      <span data-testid="low-stock-count">{lowStockCount} low stock</span>

      <div>
        <input
          data-testid="filter-input"
          type="text"
          placeholder="Search by name"
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
        />
        <select
          data-testid="filter-category"
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
        >
          <option value="All">All</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        {filtered.map(s => (
          <div key={s.id} data-testid="supply-card">
            <span data-testid="supply-name">{s.name}</span>
            <span data-testid="supply-category">{s.category}</span>
            <span data-testid="supply-quantity">{s.quantity} {s.unit}</span>
            <span data-testid="supply-status">{s.quantity <= s.reorderAt ? 'Low Stock' : 'OK'}</span>
            <button data-testid="increment-qty" onClick={() => handleIncrement(s.id)}>+</button>
            <button data-testid="decrement-qty" onClick={() => handleDecrement(s.id)}>-</button>
            <button data-testid="delete-supply" onClick={() => handleDelete(s.id)}>Delete</button>
          </div>
        ))}
      </div>

      <form data-testid="add-form" onSubmit={handleSubmit}>
        <input
          data-testid="input-name"
          type="text"
          placeholder="Supply Name"
          value={inputName}
          onChange={e => setInputName(e.target.value)}
        />
        <input
          data-testid="input-category"
          type="text"
          placeholder="Category"
          value={inputCategory}
          onChange={e => setInputCategory(e.target.value)}
        />
        <input
          data-testid="input-quantity"
          type="number"
          placeholder="Quantity"
          value={inputQuantity}
          onChange={e => setInputQuantity(e.target.value)}
        />
        <input
          data-testid="input-reorder-at"
          type="number"
          placeholder="Reorder At"
          value={inputReorderAt}
          onChange={e => setInputReorderAt(e.target.value)}
        />
        <input
          data-testid="input-unit"
          type="text"
          placeholder="Unit"
          value={inputUnit}
          onChange={e => setInputUnit(e.target.value)}
        />
        <button data-testid="submit-supply" type="submit">Add Supply</button>
        {formError && (
          <span data-testid="form-error">Please fill in all fields with valid values.</span>
        )}
      </form>
    </div>
  )
}
