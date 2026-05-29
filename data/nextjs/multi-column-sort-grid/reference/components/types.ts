export type Person = { id: number; name: string; age: number; city: string }
export type SortKey = 'name' | 'age' | 'city'
export type SortEntry = { key: SortKey; dir: 'asc' | 'desc' }
