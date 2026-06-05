export type Route = 'menu' | 'orders' | 'revenue'
export type Dish = { id: number; name: string; price: number }
export type Ticket = { id: number; dishId: number; qty: number }
