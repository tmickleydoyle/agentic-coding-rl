'use client'
import { useState } from 'react'

interface BillItem {
  id: number
  name: string
  price: number
  person: string
}

const SEED_PEOPLE = ['Alice', 'Bob', 'Carol']

const SEED_ITEMS: BillItem[] = [
  { id: 1, name: 'Caesar Salad', price: 8.50, person: 'Alice' },
  { id: 2, name: 'Margherita Pizza', price: 14.00, person: 'Bob' },
  { id: 3, name: 'Pasta Arrabiata', price: 12.50, person: 'Carol' },
  { id: 4, name: 'Garlic Bread', price: 4.00, person: 'Alice' },
]

export default function App() {
  const [people, setPeople] = useState<string[]>([...SEED_PEOPLE])
  const [items, setItems] = useState<BillItem[]>(SEED_ITEMS.map(i => ({ ...i })))
  const [nextId, setNextId] = useState(SEED_ITEMS.length + 1)

  const [personName, setPersonName] = useState('')
  const [itemName, setItemName] = useState('')
  const [itemPrice, setItemPrice] = useState('')
  const [assignTo, setAssignTo] = useState(SEED_PEOPLE[0])
  const [tipPct, setTipPct] = useState(15)

  function addPerson() {
    if (!personName.trim()) return
    const name = personName.trim()
    if (!people.includes(name)) {
      setPeople(prev => [...prev, name])
    }
    setPersonName('')
  }

  function addItem() {
    const price = parseFloat(itemPrice)
    if (!itemName.trim() || !price || price <= 0 || !assignTo) return
    setItems(prev => [...prev, { id: nextId, name: itemName.trim(), price, person: assignTo }])
    setNextId(n => n + 1)
    setItemName('')
    setItemPrice('')
  }

  function deleteItem(id: number) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const billSubtotal = items.reduce((sum, i) => sum + i.price, 0)
  const tipAmount = billSubtotal * (tipPct / 100)
  const grandTotal = billSubtotal + tipAmount

  function fmt(n: number) {
    return '$' + n.toFixed(2)
  }

  return (
    <div>
      <h1>Meal Cost Splitter</h1>

      <div>
        <label htmlFor="person-name">Person Name</label>
        <input
          id="person-name"
          value={personName}
          onChange={e => setPersonName(e.target.value)}
        />
        <button onClick={addPerson}>Add Person</button>
      </div>

      <div>
        <label htmlFor="item-name">Item Name</label>
        <input
          id="item-name"
          value={itemName}
          onChange={e => setItemName(e.target.value)}
        />

        <label htmlFor="item-price">Item Price</label>
        <input
          id="item-price"
          type="number"
          value={itemPrice}
          onChange={e => setItemPrice(e.target.value)}
        />

        <label htmlFor="assign-to">Assign To</label>
        <select
          id="assign-to"
          value={assignTo}
          onChange={e => setAssignTo(e.target.value)}
        >
          {people.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <button onClick={addItem}>Add Item</button>
      </div>

      <ul>
        {items.map(item => (
          <li key={item.id} data-testid="bill-item">
            <span data-testid="bill-item-name">{item.name}</span>
            <span data-testid="bill-item-price">{fmt(item.price)}</span>
            <span data-testid="bill-item-person">{item.person}</span>
            <button onClick={() => deleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <div>
        <label htmlFor="tip-pct">Tip %</label>
        <input
          id="tip-pct"
          type="number"
          value={tipPct}
          onChange={e => setTipPct(parseFloat(e.target.value) || 0)}
        />
      </div>

      <div data-testid="results">
        {people.map(p => {
          const personSubtotal = items
            .filter(i => i.person === p)
            .reduce((sum, i) => sum + i.price, 0)
          const personTip = billSubtotal > 0
            ? (personSubtotal / billSubtotal) * tipAmount
            : 0
          const personTotal = personSubtotal + personTip
          return (
            <p key={p} data-testid="person-total">
              {p}: {fmt(personTotal)}
            </p>
          )
        })}
        <p data-testid="grand-total">{fmt(grandTotal)}</p>
      </div>
    </div>
  )
}
