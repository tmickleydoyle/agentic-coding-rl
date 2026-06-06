import { Asset } from './types'
export function getAssets(): Asset[] { return [] }
export function addAsset(_d: Omit<Asset, 'id'>): Asset { return { id: '', name: '', category: '', purchasePrice: 0, purchaseYear: 2026, depreciationRate: 0 } }
export function __reset(): void {}
