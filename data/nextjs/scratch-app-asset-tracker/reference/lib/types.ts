export interface Asset {
  id: string
  name: string
  category: string
  purchasePrice: number
  purchaseYear: number
  depreciationRate: number
}

export type Route = 'home' | 'assets' | 'depreciation' | 'categories'

export const CURRENT_YEAR = 2026

export function currentValue(asset: Asset): number {
  const years = CURRENT_YEAR - asset.purchaseYear
  const val = asset.purchasePrice * Math.pow(1 - asset.depreciationRate / 100, years)
  return Math.max(0, Math.round(val * 100) / 100)
}
