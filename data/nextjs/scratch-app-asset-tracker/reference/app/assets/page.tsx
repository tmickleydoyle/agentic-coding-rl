'use client'
import React, { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { Asset } from '../../lib/types'
export function AssetsPage() {
  const { assets, setAssets } = useApp()
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [purchasePrice, setPurchasePrice] = useState('')
  const [purchaseYear, setPurchaseYear] = useState('')
  const [depreciationRate, setDepreciationRate] = useState('')

  const handleAdd = () => {
    if (!name) return
    const a: Asset = { id: `a${Date.now()}`, name, category, purchasePrice: parseFloat(purchasePrice) || 0, purchaseYear: parseInt(purchaseYear) || 2026, depreciationRate: parseFloat(depreciationRate) || 0 }
    setAssets([...assets, a])
    setName(''); setCategory(''); setPurchasePrice(''); setPurchaseYear(''); setDepreciationRate('')
  }

  return (
    <div data-testid="assets-page">
      <h1>Assets</h1>
      <input data-testid="input-asset-name" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
      <input data-testid="input-asset-category" value={category} onChange={e => setCategory(e.target.value)} placeholder="Category" />
      <input data-testid="input-asset-price" value={purchasePrice} onChange={e => setPurchasePrice(e.target.value)} type="number" placeholder="Purchase Price" />
      <input data-testid="input-asset-year" value={purchaseYear} onChange={e => setPurchaseYear(e.target.value)} type="number" placeholder="Purchase Year" />
      <input data-testid="input-asset-depreciation" value={depreciationRate} onChange={e => setDepreciationRate(e.target.value)} type="number" placeholder="Depreciation Rate %" />
      <button data-testid="add-asset-btn" onClick={handleAdd}>Add Asset</button>
      {assets.map(a => (
        <div key={a.id} data-testid={`asset-card-${a.id}`}>
          <span>{a.name}</span><span>{a.category}</span><span>{a.purchasePrice}</span><span>{a.purchaseYear}</span><span>{a.depreciationRate}%</span>
        </div>
      ))}
    </div>
  )
}
