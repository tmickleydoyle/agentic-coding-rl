'use client'
import { useState } from 'react'

type VehicleClass = 'Car' | 'Motorcycle' | 'Truck' | 'RV'
type PaymentMethod = 'EZPass' | 'Cash' | 'Credit Card'

interface Toll {
  id: number
  date: string
  road: string
  plaza: string
  amount: number
  vehicleClass: VehicleClass
  paymentMethod: PaymentMethod
}

const SEED: Toll[] = [
  { id: 1, date: '2024-01-10', road: 'I-95 North', plaza: 'Exit 12', amount: 3.50, vehicleClass: 'Car', paymentMethod: 'EZPass' },
  { id: 2, date: '2024-01-10', road: 'Turnpike', plaza: 'Interchange 6', amount: 5.75, vehicleClass: 'Car', paymentMethod: 'Cash' },
  { id: 3, date: '2024-01-15', road: 'I-95 North', plaza: 'Exit 22', amount: 4.00, vehicleClass: 'Car', paymentMethod: 'EZPass' },
  { id: 4, date: '2024-01-20', road: 'Garden State Pkwy', plaza: 'Exit 100', amount: 1.25, vehicleClass: 'Motorcycle', paymentMethod: 'EZPass' },
]

export default function App() {
  const [tolls, setTolls] = useState<Toll[]>(SEED.map(t => ({ ...t })))
  const [date, setDate] = useState('')
  const [road, setRoad] = useState('')
  const [plaza, setPlaza] = useState('')
  const [amount, setAmount] = useState('')
  const [vehicleClass, setVehicleClass] = useState<VehicleClass>('Car')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('EZPass')
  const [error, setError] = useState('')
  const [paymentFilter, setPaymentFilter] = useState('All')
  const [vehicleFilter, setVehicleFilter] = useState('All')
  const [nextId, setNextId] = useState(5)

  const handleAdd = () => {
    if (!date || !road.trim() || !plaza.trim() || !amount || Number(amount) <= 0) {
      setError('Please fill in all required fields')
      return
    }
    setError('')
    setTolls(prev => [...prev, {
      id: nextId,
      date,
      road: road.trim(),
      plaza: plaza.trim(),
      amount: Number(amount),
      vehicleClass,
      paymentMethod,
    }])
    setNextId(n => n + 1)
    setDate('')
    setRoad('')
    setPlaza('')
    setAmount('')
    setVehicleClass('Car')
    setPaymentMethod('EZPass')
  }

  const handleDelete = (id: number) => {
    setTolls(prev => prev.filter(t => t.id !== id))
  }

  const filtered = tolls.filter(t => {
    const matchPayment = paymentFilter === 'All' || t.paymentMethod === paymentFilter
    const matchVehicle = vehicleFilter === 'All' || t.vehicleClass === vehicleFilter
    return matchPayment && matchVehicle
  })

  const totalAmount = tolls.reduce((sum, t) => sum + t.amount, 0)
  const ezpassTotal = tolls.filter(t => t.paymentMethod === 'EZPass').reduce((sum, t) => sum + t.amount, 0)
  const cashTotal = tolls.filter(t => t.paymentMethod === 'Cash').reduce((sum, t) => sum + t.amount, 0)

  const computeTopRoad = (): string => {
    if (tolls.length === 0) return 'N/A'
    const roadTotals: Record<string, number> = {}
    tolls.forEach(t => {
      roadTotals[t.road] = (roadTotals[t.road] || 0) + t.amount
    })
    let topRoad = ''
    let topAmount = -1
    Object.keys(roadTotals).forEach(r => {
      if (roadTotals[r] > topAmount) {
        topAmount = roadTotals[r]
        topRoad = r
      }
    })
    return topRoad
  }

  return (
    <div>
      <h1>Toll Calculator</h1>

      <div>
        <h2>Add Toll</h2>
        {error && <p data-testid="error-msg">{error}</p>}
        <div>
          <label htmlFor="date-input">Date</label>
          <input
            id="date-input"
            data-testid="date-input"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="road-input">Road</label>
          <input
            id="road-input"
            data-testid="road-input"
            value={road}
            onChange={e => setRoad(e.target.value)}
            placeholder="Road or highway"
          />
        </div>
        <div>
          <label htmlFor="plaza-input">Plaza</label>
          <input
            id="plaza-input"
            data-testid="plaza-input"
            value={plaza}
            onChange={e => setPlaza(e.target.value)}
            placeholder="Toll plaza or exit"
          />
        </div>
        <div>
          <label htmlFor="amount-input">Amount ($)</label>
          <input
            id="amount-input"
            data-testid="amount-input"
            type="number"
            step="0.25"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="vehicle-select">Vehicle Class</label>
          <select
            id="vehicle-select"
            data-testid="vehicle-select"
            value={vehicleClass}
            onChange={e => setVehicleClass(e.target.value as VehicleClass)}
          >
            <option value="Car">Car</option>
            <option value="Motorcycle">Motorcycle</option>
            <option value="Truck">Truck</option>
            <option value="RV">RV</option>
          </select>
        </div>
        <div>
          <label htmlFor="payment-select">Payment Method</label>
          <select
            id="payment-select"
            data-testid="payment-select"
            value={paymentMethod}
            onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
          >
            <option value="EZPass">EZPass</option>
            <option value="Cash">Cash</option>
            <option value="Credit Card">Credit Card</option>
          </select>
        </div>
        <button data-testid="add-btn" onClick={handleAdd}>Add Toll</button>
      </div>

      <div>
        <h2>Summary</h2>
        <p>Total Tolls: <span data-testid="total-tolls">{tolls.length}</span></p>
        <p>Total Amount: <span data-testid="total-amount">${totalAmount.toFixed(2)}</span></p>
        <p>EZPass Total: <span data-testid="ezpass-total">${ezpassTotal.toFixed(2)}</span></p>
        <p>Cash Total: <span data-testid="cash-total">${cashTotal.toFixed(2)}</span></p>
        <p>Top Road: <span data-testid="top-road">{computeTopRoad()}</span></p>
      </div>

      <div>
        <label htmlFor="payment-filter">Filter by Payment</label>
        <select
          id="payment-filter"
          data-testid="payment-filter"
          value={paymentFilter}
          onChange={e => setPaymentFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="EZPass">EZPass</option>
          <option value="Cash">Cash</option>
          <option value="Credit Card">Credit Card</option>
        </select>
      </div>

      <div>
        <label htmlFor="vehicle-filter">Filter by Vehicle</label>
        <select
          id="vehicle-filter"
          data-testid="vehicle-filter"
          value={vehicleFilter}
          onChange={e => setVehicleFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Car">Car</option>
          <option value="Motorcycle">Motorcycle</option>
          <option value="Truck">Truck</option>
          <option value="RV">RV</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Road</th>
            <th>Plaza</th>
            <th>Amount</th>
            <th>Vehicle</th>
            <th>Payment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(t => (
            <tr key={t.id} data-testid="toll-row">
              <td data-testid={`date-${t.id}`}>{t.date}</td>
              <td data-testid={`road-${t.id}`}>{t.road}</td>
              <td data-testid={`plaza-${t.id}`}>{t.plaza}</td>
              <td data-testid={`amount-${t.id}`}>${t.amount.toFixed(2)}</td>
              <td data-testid={`vehicle-${t.id}`}>{t.vehicleClass}</td>
              <td data-testid={`payment-${t.id}`}>{t.paymentMethod}</td>
              <td>
                <button data-testid={`delete-btn-${t.id}`} onClick={() => handleDelete(t.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
