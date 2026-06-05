export type Route = 'ledger' | 'categories' | 'report'
export type Category = 'Sales' | 'Supplies' | 'Other'
export type EntryType = 'in' | 'out'
export type Entry = { id: number; memo: string; amount: number; category: Category; type: EntryType }
export const CATEGORIES: Category[] = ['Sales', 'Supplies', 'Other']
