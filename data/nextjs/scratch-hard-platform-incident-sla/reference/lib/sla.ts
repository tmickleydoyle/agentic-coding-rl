import { SLA_TARGET } from './types'
import type { Incident } from './types'

export type SlaState = 'breached' | 'at risk' | 'on track'

export function slaState(inc: Incident): SlaState {
  const target = SLA_TARGET[inc.priority]
  if (inc.hours >= target) return 'breached'
  if (inc.hours >= 0.75 * target) return 'at risk'
  return 'on track'
}

export function ratio(inc: Incident): number {
  return inc.hours / SLA_TARGET[inc.priority]
}
