'use client'
import { useState } from 'react'

interface Jar {
  id: number
  name: string
  target: number
  balance: number
}

const SEED: Jar[] = [
  { id: 1, name: 'Vacation Fund', target: 1500.00, balance: 320.00 },
  { id: 2, name: 'New Laptop', target: 800.00, balance: 150.00 },
  { id: 3, name: 'Emergency', target: 2000.00, balance: 2000.00 },
]

export default function App() {
  const [jars, setJars] = useState<Jar[]>(SEED.map(j => ({ ...j })))
  const [newName, setNewName] = useState('')
  const [newTarget, setNewTarget] = useState('')
  const [deposits, setDeposits] = useState<Record<number, string>>({})
  const [withdrawals, setWithdrawals] = useState<Record<number, string>>({})

  function addJar() {
    const name = newName.trim()
    const target = parseFloat(newTarget)
    if (!name || isNaN(target) || target <= 0) return
    const maxId = jars.reduce((m, j) => Math.max(m, j.id), 0)
    setJars(prev => [...prev, { id: maxId + 1, name, target, balance: 0 }])
    setNewName('')
    setNewTarget('')
  }

  function deposit(id: number) {
    const val = parseFloat(deposits[id] || '')
    if (isNaN(val) || val <= 0) return
    setJars(prev => prev.map(j => {
      if (j.id !== id) return j
      return { ...j, balance: Math.min(j.target, j.balance + val) }
    }))
    setDeposits(prev => ({ ...prev, [id]: '' }))
  }

  function withdraw(id: number) {
    const val = parseFloat(withdrawals[id] || '')
    if (isNaN(val) || val <= 0) return
    setJars(prev => prev.map(j => {
      if (j.id !== id) return j
      return { ...j, balance: Math.max(0, j.balance - val) }
    }))
    setWithdrawals(prev => ({ ...prev, [id]: '' }))
  }

  function deleteJar(id: number) {
    setJars(prev => prev.filter(j => j.id !== id))
  }

  return (
    <div>
      <h1>Savings Jar</h1>

      <div data-testid="add-jar-form">
        <input
          data-testid="jar-name-input"
          type="text"
          placeholder="Jar name"
          value={newName}
          onChange={e => setNewName(e.target.value)}
        />
        <input
          data-testid="jar-target-input"
          type="number"
          placeholder="Target amount"
          value={newTarget}
          onChange={e => setNewTarget(e.target.value)}
        />
        <button data-testid="add-jar-btn" onClick={addJar}>Add Jar</button>
      </div>

      <div data-testid="jar-list">
        {jars.map(jar => {
          const pct = Math.min(100, Math.floor((jar.balance / jar.target) * 100))
          const complete = jar.balance >= jar.target
          return (
            <div key={jar.id} data-testid={`jar-${jar.id}`}>
              <h2 data-testid={`jar-name-${jar.id}`}>{jar.name}</h2>

              <div data-testid={`progress-bar-${jar.id}`} style={{ background: '#eee', width: '100%', height: 16 }}>
                <div style={{ width: `${pct}%`, height: '100%', background: '#4caf50' }} />
              </div>

              <span data-testid={`jar-balance-${jar.id}`}>
                ${jar.balance.toFixed(2)} saved of ${jar.target.toFixed(2)}
              </span>

              <span data-testid={`jar-pct-${jar.id}`}>{pct}%</span>

              <span data-testid={`jar-status-${jar.id}`}>
                {complete ? 'Complete' : 'In Progress'}
              </span>

              <div>
                <input
                  data-testid={`deposit-input-${jar.id}`}
                  type="number"
                  placeholder="Deposit"
                  value={deposits[jar.id] || ''}
                  onChange={e => setDeposits(prev => ({ ...prev, [jar.id]: e.target.value }))}
                />
                <button data-testid={`deposit-btn-${jar.id}`} onClick={() => deposit(jar.id)}>Deposit</button>
              </div>

              <div>
                <input
                  data-testid={`withdraw-input-${jar.id}`}
                  type="number"
                  placeholder="Withdraw"
                  value={withdrawals[jar.id] || ''}
                  onChange={e => setWithdrawals(prev => ({ ...prev, [jar.id]: e.target.value }))}
                />
                <button data-testid={`withdraw-btn-${jar.id}`} onClick={() => withdraw(jar.id)}>Withdraw</button>
              </div>

              <button data-testid={`delete-btn-${jar.id}`} onClick={() => deleteJar(jar.id)}>Delete</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
