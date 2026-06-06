'use client'
import { useState } from 'react'

type CommissionStatus = 'pending' | 'in-progress' | 'completed'

interface Commission {
  id: number
  client: string
  description: string
  price: number
  status: CommissionStatus
  deadline: string
}

const SEED: Commission[] = [
  { id: 1, client: 'Alice Morgan', description: 'Portrait painting', price: 600, status: 'in-progress', deadline: '2024-03-15' },
  { id: 2, client: 'Ben Liu', description: 'Logo illustration', price: 250, status: 'pending', deadline: '2024-04-01' },
  { id: 3, client: 'Carol Smith', description: 'Wedding invitation suite', price: 400, status: 'completed', deadline: '2024-02-28' },
  { id: 4, client: 'David Park', description: 'Book cover design', price: 350, status: 'pending', deadline: '2024-05-10' },
]

export default function App() {
  const [commissions, setCommissions] = useState<Commission[]>(SEED.map(x => ({ ...x })))
  const [filterStatus, setFilterStatus] = useState<string>('All')

  const [inputClient, setInputClient] = useState('')
  const [inputDescription, setInputDescription] = useState('')
  const [inputPrice, setInputPrice] = useState('')
  const [inputDeadline, setInputDeadline] = useState('')
  const [inputStatus, setInputStatus] = useState<CommissionStatus>('pending')
  const [formError, setFormError] = useState(false)

  const nextId = () => Math.max(0, ...commissions.map(c => c.id)) + 1

  const filtered = commissions.filter(c =>
    filterStatus === 'All' ? true : c.status === filterStatus
  )

  const totalRevenue = commissions
    .filter(c => c.status === 'completed')
    .reduce((sum, c) => sum + c.price, 0)

  const handleStatusChange = (id: number, status: CommissionStatus) => {
    setCommissions(prev => prev.map(c => c.id === id ? { ...c, status } : c))
  }

  const handleDelete = (id: number) => {
    setCommissions(prev => prev.filter(c => c.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const price = parseFloat(inputPrice)
    if (!inputClient.trim() || !inputDescription.trim() || isNaN(price) || price <= 0) {
      setFormError(true)
      return
    }
    setFormError(false)
    const newCommission: Commission = {
      id: nextId(),
      client: inputClient.trim(),
      description: inputDescription.trim(),
      price,
      status: inputStatus,
      deadline: inputDeadline,
    }
    setCommissions(prev => [...prev, newCommission])
    setInputClient('')
    setInputDescription('')
    setInputPrice('')
    setInputDeadline('')
    setInputStatus('pending')
  }

  return (
    <div>
      <h1>Commission Tracker</h1>
      <span data-testid="total-revenue">Total Earned: ${totalRevenue}</span>
      <span data-testid="commission-count">{commissions.length} commissions</span>

      <div>
        <select
          data-testid="filter-status"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="All">All</option>
          <option value="pending">pending</option>
          <option value="in-progress">in-progress</option>
          <option value="completed">completed</option>
        </select>
      </div>

      <div>
        {filtered.map(c => (
          <div key={c.id} data-testid="commission-card">
            <span data-testid="commission-client">{c.client}</span>
            <span data-testid="commission-description">{c.description}</span>
            <span data-testid="commission-price">${c.price}</span>
            <span data-testid="commission-status">{c.status}</span>
            <span data-testid="commission-deadline">{c.deadline}</span>
            <select
              data-testid="status-select"
              value={c.status}
              onChange={e => handleStatusChange(c.id, e.target.value as CommissionStatus)}
            >
              <option value="pending">pending</option>
              <option value="in-progress">in-progress</option>
              <option value="completed">completed</option>
            </select>
            <button
              data-testid="delete-commission"
              onClick={() => handleDelete(c.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <form data-testid="add-form" onSubmit={handleSubmit}>
        <input
          data-testid="input-client"
          type="text"
          placeholder="Client Name"
          value={inputClient}
          onChange={e => setInputClient(e.target.value)}
        />
        <input
          data-testid="input-description"
          type="text"
          placeholder="Description"
          value={inputDescription}
          onChange={e => setInputDescription(e.target.value)}
        />
        <input
          data-testid="input-price"
          type="number"
          placeholder="Price"
          value={inputPrice}
          onChange={e => setInputPrice(e.target.value)}
        />
        <input
          data-testid="input-deadline"
          type="date"
          value={inputDeadline}
          onChange={e => setInputDeadline(e.target.value)}
        />
        <select
          data-testid="input-status"
          value={inputStatus}
          onChange={e => setInputStatus(e.target.value as CommissionStatus)}
        >
          <option value="pending">pending</option>
          <option value="in-progress">in-progress</option>
          <option value="completed">completed</option>
        </select>
        <button data-testid="submit-commission" type="submit">Add Commission</button>
        {formError && (
          <span data-testid="form-error">Please provide client, description, and a valid price.</span>
        )}
      </form>
    </div>
  )
}
