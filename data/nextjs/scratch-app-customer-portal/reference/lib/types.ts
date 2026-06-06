export interface Ticket {
  id: string
  subject: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'resolved' | 'closed'
  createdAt: string
}

export interface Order {
  id: string
  orderNumber: string
  date: string
  total: number
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled'
}

export interface Profile {
  id: string
  name: string
  email: string
  phone: string
  address: string
}

export type Route = 'home' | 'tickets' | 'orders' | 'profile'
