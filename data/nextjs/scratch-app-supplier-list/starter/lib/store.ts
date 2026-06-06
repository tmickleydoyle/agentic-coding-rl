import { Supplier, Contact, Contract } from './types'

export function __reset() {}
export function getSuppliers(): Supplier[] { return [] }
export function addSupplier(_d: Omit<Supplier, 'id' | 'status'>): Supplier { return {} as Supplier }
export function toggleSupplier(_id: string): Supplier | null { return null }
export function getContacts(): Contact[] { return [] }
export function addContact(_d: Omit<Contact, 'id'>): Contact { return {} as Contact }
export function getContracts(): Contract[] { return [] }
export function addContract(_d: Omit<Contract, 'id' | 'status'>): Contract { return {} as Contract }
