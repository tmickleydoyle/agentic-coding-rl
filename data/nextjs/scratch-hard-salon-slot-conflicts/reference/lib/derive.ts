import type { Appt } from './types'
import { overlaps } from './types'

// Set of ids that conflict with at least one other appointment.
export function conflictingIds(appts: Appt[]): Set<number> {
  const ids = new Set<number>()
  for (let i = 0; i < appts.length; i++) {
    for (let j = i + 1; j < appts.length; j++) {
      if (overlaps(appts[i], appts[j])) {
        ids.add(appts[i].id)
        ids.add(appts[j].id)
      }
    }
  }
  return ids
}
