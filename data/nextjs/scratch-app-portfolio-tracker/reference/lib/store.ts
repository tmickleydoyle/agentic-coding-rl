import { Holding, Transaction } from './types'
let holdings: Holding[] = [
  { id: 'h1', symbol: 'AAPL', name: 'Apple Inc.', quantity: 10, purchasePrice: 150, currentPrice: 175 },
  { id: 'h2', symbol: 'MSFT', name: 'Microsoft Corp.', quantity: 5, purchasePrice: 280, currentPrice: 320 },
  { id: 'h3', symbol: 'GOOGL', name: 'Alphabet Inc.', quantity: 2, purchasePrice: 2800, currentPrice: 2950 },
]
let transactions: Transaction[] = [
  { id: 't1', symbol: 'AAPL', type: 'buy', quantity: 10, price: 150, date: '2024-01-15' },
  { id: 't2', symbol: 'MSFT', type: 'buy', quantity: 5, price: 280, date: '2024-02-10' },
]
let nextId = 100
function uid() { return String(++nextId) }
export function getHoldings() { return [...holdings] }
export function addHolding(d: Omit<Holding,'id'>): Holding { const h = { id: uid(), ...d }; holdings.push(h); return h }
export function deleteHolding(id: string): boolean { const l = holdings.length; holdings = holdings.filter(h => h.id !== id); return holdings.length < l }
export function getTransactions() { return [...transactions] }
export function addTransaction(d: Omit<Transaction,'id'>): Transaction { const t = { id: uid(), ...d }; transactions.push(t); return t }
export function __reset() {
  holdings = [
    { id: 'h1', symbol: 'AAPL', name: 'Apple Inc.', quantity: 10, purchasePrice: 150, currentPrice: 175 },
    { id: 'h2', symbol: 'MSFT', name: 'Microsoft Corp.', quantity: 5, purchasePrice: 280, currentPrice: 320 },
    { id: 'h3', symbol: 'GOOGL', name: 'Alphabet Inc.', quantity: 2, purchasePrice: 2800, currentPrice: 2950 },
  ]
  transactions = [
    { id: 't1', symbol: 'AAPL', type: 'buy', quantity: 10, price: 150, date: '2024-01-15' },
    { id: 't2', symbol: 'MSFT', type: 'buy', quantity: 5, price: 280, date: '2024-02-10' },
  ]
  nextId = 100
}
