'use client'
import type { AisleGroup } from '../lib/types'

export default function AisleSection({ group }: { group: AisleGroup }) {
  return (
    <section data-testid={`aisle-${group.aisle}`}>
      <h3 data-testid={`aisle-${group.aisle}-name`}>{group.aisle}</h3>
      <span data-testid={`aisle-${group.aisle}-count`}>{group.items.length}</span>
      <ul>
        {group.items.map((i) => (
          <li key={i.id} data-testid={`aisle-item-${i.id}`}>
            {i.name}
          </li>
        ))}
      </ul>
    </section>
  )
}
