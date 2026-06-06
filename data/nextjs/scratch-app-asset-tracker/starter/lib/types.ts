export interface Asset { id: string; name: string; category: string; purchasePrice: number; purchaseYear: number; depreciationRate: number }
export type Route = 'home' | 'assets' | 'depreciation' | 'categories'
export const CURRENT_YEAR = 2026
export function currentValue(_asset: Asset): number { return 0 }
