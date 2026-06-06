'use client'
import { useState } from 'react'

interface Entry {
  id: number
  name: string
  value: number
}

const SEED_ASSETS: Entry[] = [
  { id: 1, name: 'Checking Account', value: 5000 },
  { id: 2, name: 'Savings Account', value: 20000 },
  { id: 3, name: 'Investment Portfolio', value: 45000 },
]

const SEED_LIABILITIES: Entry[] = [
  { id: 101, name: 'Car Loan', value: 8000 },
  { id: 102, name: 'Student Loans', value: 25000 },
]

let nextAssetId = 4
let nextLiabilityId = 103

function fmt(n: number): string {
  return (n < 0 ? '-' : '') + '$' + Math.abs(n).toFixed(2)
}

export default function App() {
  const [assets, setAssets] = useState<Entry[]>(SEED_ASSETS.map(x => ({ ...x })))
  const [liabilities, setLiabilities] = useState<Entry[]>(SEED_LIABILITIES.map(x => ({ ...x })))

  const [assetName, setAssetName] = useState('')
  const [assetValue, setAssetValue] = useState('')
  const [liabilityName, setLiabilityName] = useState('')
  const [liabilityValue, setLiabilityValue] = useState('')

  const totalAssets = assets.reduce((s, a) => s + a.value, 0)
  const totalLiabilities = liabilities.reduce((s, l) => s + l.value, 0)
  const netWorth = totalAssets - totalLiabilities

  function addAsset() {
    if (!assetName.trim()) return
    setAssets(xs => [...xs, { id: nextAssetId++, name: assetName.trim(), value: parseFloat(assetValue) || 0 }])
    setAssetName('')
    setAssetValue('')
  }

  function addLiability() {
    if (!liabilityName.trim()) return
    setLiabilities(xs => [...xs, { id: nextLiabilityId++, name: liabilityName.trim(), value: parseFloat(liabilityValue) || 0 }])
    setLiabilityName('')
    setLiabilityValue('')
  }

  return (
    <div>
      <h1>Net Worth Tracker</h1>

      <section>
        <h2>Assets</h2>
        <ul>
          {assets.map(a => (
            <li key={a.id} data-testid="asset-row">
              <span>{a.name}</span>
              <span>${a.value.toFixed(2)}</span>
              <button onClick={() => setAssets(xs => xs.filter(x => x.id !== a.id))}>Delete</button>
            </li>
          ))}
        </ul>
        <p data-testid="total-assets">Total Assets: ${totalAssets.toFixed(2)}</p>
        <div>
          <input
            aria-label="Asset Name"
            value={assetName}
            onChange={e => setAssetName(e.target.value)}
            placeholder="Asset Name"
          />
          <input
            aria-label="Asset Value"
            type="number"
            value={assetValue}
            onChange={e => setAssetValue(e.target.value)}
            placeholder="Value"
          />
          <button onClick={addAsset} disabled={!assetName.trim()}>Add Asset</button>
        </div>
      </section>

      <section>
        <h2>Liabilities</h2>
        <ul>
          {liabilities.map(l => (
            <li key={l.id} data-testid="liability-row">
              <span>{l.name}</span>
              <span>${l.value.toFixed(2)}</span>
              <button onClick={() => setLiabilities(xs => xs.filter(x => x.id !== l.id))}>Delete</button>
            </li>
          ))}
        </ul>
        <p data-testid="total-liabilities">Total Liabilities: ${totalLiabilities.toFixed(2)}</p>
        <div>
          <input
            aria-label="Liability Name"
            value={liabilityName}
            onChange={e => setLiabilityName(e.target.value)}
            placeholder="Liability Name"
          />
          <input
            aria-label="Liability Value"
            type="number"
            value={liabilityValue}
            onChange={e => setLiabilityValue(e.target.value)}
            placeholder="Value"
          />
          <button onClick={addLiability} disabled={!liabilityName.trim()}>Add Liability</button>
        </div>
      </section>

      <section>
        <h2>Net Worth</h2>
        <p data-testid="net-worth">Net Worth: {fmt(netWorth)}</p>
        <p data-testid="net-worth-status">{netWorth >= 0 ? 'Positive Net Worth' : 'Negative Net Worth'}</p>
      </section>
    </div>
  )
}
