export interface Supplier { id: string; name: string; category: string; country: string; status: 'active' | 'inactive' }
export interface Contact { id: string; name: string; email: string; phone: string; supplierId: string; role: string }
export interface Contract { id: string; supplierId: string; startDate: string; endDate: string; value: number; status: 'active' | 'expired' }
export type Route = 'home' | 'suppliers' | 'contacts' | 'contracts'
