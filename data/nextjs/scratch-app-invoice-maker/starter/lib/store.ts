import { Client, Invoice } from './types'
export function getClients(): Client[] { return [] }
export function addClient(_d: Omit<Client, 'id'>): Client { return { id: '', name: '', email: '' } }
export function getInvoices(): Invoice[] { return [] }
export function addInvoice(_d: Omit<Invoice, 'id'>): Invoice { return { id: '', clientId: '', status: 'draft', items: [], taxRate: 0, createdAt: '' } }
export function __reset(): void {}
