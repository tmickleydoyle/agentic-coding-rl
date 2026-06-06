import { Supplier, Contact, Contract } from './types'

const seedSuppliers: Supplier[] = [
  { id: 'sup1', name: 'Acme Corp', category: 'Electronics', country: 'USA', status: 'active' },
  { id: 'sup2', name: 'Global Parts Ltd', category: 'Components', country: 'UK', status: 'active' },
  { id: 'sup3', name: 'FastShip Co', category: 'Logistics', country: 'Germany', status: 'inactive' },
  { id: 'sup4', name: 'TechSource Inc', category: 'Electronics', country: 'Taiwan', status: 'active' },
  { id: 'sup5', name: 'BulkGoods SA', category: 'Raw Materials', country: 'Brazil', status: 'active' },
]

const seedContacts: Contact[] = [
  { id: 'con1', name: 'John Smith', email: 'john@acme.com', phone: '555-0101', supplierId: 'sup1', role: 'Account Manager' },
  { id: 'con2', name: 'Emily Jones', email: 'emily@globalparts.com', phone: '555-0102', supplierId: 'sup2', role: 'Sales Director' },
  { id: 'con3', name: 'Hans Mueller', email: 'hans@fastship.de', phone: '555-0103', supplierId: 'sup3', role: 'Operations' },
  { id: 'con4', name: 'Wei Chen', email: 'wei@techsource.com', phone: '555-0104', supplierId: 'sup4', role: 'Technical Lead' },
  { id: 'con5', name: 'Maria Santos', email: 'maria@bulkgoods.com', phone: '555-0105', supplierId: 'sup5', role: 'Procurement' },
]

const seedContracts: Contract[] = [
  { id: 'ct1', supplierId: 'sup1', startDate: '2024-01-01', endDate: '2024-12-31', value: 50000, status: 'active' },
  { id: 'ct2', supplierId: 'sup2', startDate: '2023-01-01', endDate: '2023-12-31', value: 30000, status: 'expired' },
  { id: 'ct3', supplierId: 'sup4', startDate: '2024-03-01', endDate: '2025-02-28', value: 75000, status: 'active' },
  { id: 'ct4', supplierId: 'sup5', startDate: '2024-06-01', endDate: '2024-11-30', value: 20000, status: 'active' },
]

let suppliers: Supplier[] = seedSuppliers.map(s => ({ ...s }))
let contacts: Contact[] = seedContacts.map(c => ({ ...c }))
let contracts: Contract[] = seedContracts.map(c => ({ ...c }))
let nextId = 100

export function __reset() {
  suppliers = seedSuppliers.map(s => ({ ...s }))
  contacts = seedContacts.map(c => ({ ...c }))
  contracts = seedContracts.map(c => ({ ...c }))
  nextId = 100
}

export function getSuppliers(): Supplier[] { return suppliers }
export function addSupplier(data: Omit<Supplier, 'id' | 'status'>): Supplier {
  const s: Supplier = { ...data, id: `sup${nextId++}`, status: 'active' }
  suppliers.push(s)
  return s
}
export function toggleSupplier(id: string): Supplier | null {
  const s = suppliers.find(x => x.id === id)
  if (!s) return null
  s.status = s.status === 'active' ? 'inactive' : 'active'
  return s
}

export function getContacts(): Contact[] { return contacts }
export function addContact(data: Omit<Contact, 'id'>): Contact {
  const c: Contact = { ...data, id: `con${nextId++}` }
  contacts.push(c)
  return c
}

export function getContracts(): Contract[] { return contracts }
export function addContract(data: Omit<Contract, 'id' | 'status'>): Contract {
  const today = new Date().toISOString().slice(0, 10)
  const status: Contract['status'] = data.endDate < today ? 'expired' : 'active'
  const c: Contract = { ...data, id: `ct${nextId++}`, status }
  contracts.push(c)
  return c
}
