export type Route = 'invoices' | 'clients' | 'reports'
export type Invoice = {
  id: number
  label: string
  client: string
  amount: number
  daysOld: number
  paid: boolean
}
export const SEED_CLIENTS = ['Acme Co', 'Beanstalk', 'Cogwheel']

export function bucketOf(daysOld: number): 'current' | 'overdue' | 'critical' {
  if (daysOld <= 30) return 'current'
  if (daysOld <= 60) return 'overdue'
  return 'critical'
}
