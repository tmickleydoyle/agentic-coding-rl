'use client'
import type { Kpi } from '../lib/types'

export default function KpiCard(_props: { kpi: Kpi; onOpen: (id: string) => void }) {
  // TODO: render kpi-<id> with data-ontrack/data-trend and -name/-current/-target/-status/
  // -trend spans + an open-<id> button.
  return <li data-testid={`kpi-${_props.kpi.id}`} />
}
