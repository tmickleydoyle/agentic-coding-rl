export type Route = 'sales' | 'services' | 'reports' | 'settings'
export type Sale = { id: number; client: string; service: string; tip: number }
export const SERVICES: { name: string; price: number }[] = [
  { name: 'Haircut', price: 40 },
  { name: 'Color', price: 90 },
  { name: 'Manicure', price: 25 },
]
export function priceOf(service: string): number {
  const s = SERVICES.find((x) => x.name === service)
  return s ? s.price : 0
}
