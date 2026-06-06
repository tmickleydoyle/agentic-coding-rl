export interface Location { id: string; code: string; zone: string; capacity: number }
export interface InventoryItem { id: string; name: string; sku: string; quantity: number; locationId: string; category: string }
export interface Movement { id: string; itemId: string; type: 'inbound' | 'outbound'; quantity: number; date: string; notes: string }
export type Route = 'home' | 'inventory' | 'locations' | 'movements'
