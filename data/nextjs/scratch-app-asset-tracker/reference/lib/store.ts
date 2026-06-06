import { Asset } from './types'

const SEED_ASSETS: Asset[] = [
  { id: 'a1', name: 'MacBook Pro', category: 'Electronics', purchasePrice: 3000, purchaseYear: 2024, depreciationRate: 25 },
  { id: 'a2', name: 'Office Desk', category: 'Furniture', purchasePrice: 800, purchaseYear: 2022, depreciationRate: 10 },
  { id: 'a3', name: 'Company Car', category: 'Vehicles', purchasePrice: 30000, purchaseYear: 2023, depreciationRate: 15 },
  { id: 'a4', name: 'Laptop Stand', category: 'Electronics', purchasePrice: 150, purchaseYear: 2025, depreciationRate: 25 },
]

let assets: Asset[] = SEED_ASSETS.map(a => ({ ...a }))

export function getAssets(): Asset[] { return [...assets] }

export function addAsset(data: Omit<Asset, 'id'>): Asset {
  const a: Asset = { id: `a${Date.now()}`, ...data }
  assets.push(a)
  return a
}

export function __reset(): void {
  assets = SEED_ASSETS.map(a => ({ ...a }))
}
