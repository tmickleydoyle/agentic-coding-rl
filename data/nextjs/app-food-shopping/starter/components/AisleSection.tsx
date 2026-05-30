'use client'
import type { AisleGroup } from '../lib/types'

export default function AisleSection(_props: { group: AisleGroup }) {
  // TODO: render the aisle group (name, item count, item names).
  return <section data-testid={`aisle-${_props.group.aisle}`} />
}
