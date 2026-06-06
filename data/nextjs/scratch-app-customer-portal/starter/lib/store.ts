import { Ticket, Order, Profile } from './types'

export function __reset() {}
export function getTickets(): Ticket[] { return [] }
export function addTicket(_d: { subject: string; priority: Ticket['priority'] }): Ticket { return {} as Ticket }
export function closeTicket(_id: string): Ticket | null { return null }
export function getOrders(): Order[] { return [] }
export function addOrder(_d: { orderNumber: string; date: string; total: number }): Order { return {} as Order }
export function getProfile(): Profile { return {} as Profile }
export function updateProfile(_d: Partial<Omit<Profile, 'id'>>): Profile { return {} as Profile }
