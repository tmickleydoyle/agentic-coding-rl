import type { Ticket } from './types'
export function label(t: Ticket): string {
  return `#${t.num} Table ${t.table} - ${t.item} [${t.stage}]`
}
