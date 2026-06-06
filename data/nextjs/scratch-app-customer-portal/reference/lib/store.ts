import { Ticket, Order, Profile } from './types'

const seedTickets: Ticket[] = [
  { id: 't1', subject: 'Login issue', priority: 'high', status: 'open', createdAt: '2024-05-01' },
  { id: 't2', subject: 'Payment failed', priority: 'urgent', status: 'open', createdAt: '2024-05-10' },
  { id: 't3', subject: 'Delivery delay', priority: 'medium', status: 'resolved', createdAt: '2024-04-20' },
  { id: 't4', subject: 'Wrong item received', priority: 'high', status: 'open', createdAt: '2024-05-15' },
]

const seedOrders: Order[] = [
  { id: 'o1', orderNumber: 'ORD-001', date: '2024-04-01', total: 89.99, status: 'delivered' },
  { id: 'o2', orderNumber: 'ORD-002', date: '2024-04-15', total: 249.00, status: 'shipped' },
  { id: 'o3', orderNumber: 'ORD-003', date: '2024-05-01', total: 34.50, status: 'pending' },
  { id: 'o4', orderNumber: 'ORD-004', date: '2024-05-10', total: 120.00, status: 'pending' },
]

const seedProfile: Profile = { id: 'p1', name: 'Alex Customer', email: 'alex@example.com', phone: '555-1234', address: '123 Main St' }

let tickets: Ticket[] = seedTickets.map(t => ({ ...t }))
let orders: Order[] = seedOrders.map(o => ({ ...o }))
let profile: Profile = { ...seedProfile }
let nextId = 100

export function __reset() {
  tickets = seedTickets.map(t => ({ ...t }))
  orders = seedOrders.map(o => ({ ...o }))
  profile = { ...seedProfile }
  nextId = 100
}

export function getTickets(): Ticket[] { return tickets }
export function addTicket(data: { subject: string; priority: Ticket['priority'] }): Ticket {
  const t: Ticket = { ...data, id: `t${nextId++}`, status: 'open', createdAt: new Date().toISOString().slice(0, 10) }
  tickets.push(t)
  return t
}
export function closeTicket(id: string): Ticket | null {
  const t = tickets.find(x => x.id === id)
  if (!t) return null
  t.status = 'closed'
  return t
}

export function getOrders(): Order[] { return orders }
export function addOrder(data: { orderNumber: string; date: string; total: number }): Order {
  const o: Order = { ...data, id: `o${nextId++}`, status: 'pending' }
  orders.push(o)
  return o
}

export function getProfile(): Profile { return profile }
export function updateProfile(data: Partial<Omit<Profile, 'id'>>): Profile {
  Object.assign(profile, data)
  return profile
}
