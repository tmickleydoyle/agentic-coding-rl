'use client'
import { useCrm } from '../../components/AppStateProvider'

export default function PropertiesPage() {
  const { properties, leads } = useCrm()

  const leadCount = (propertyId: string): number =>
    leads.filter((l) => l.propertyId === propertyId).length

  return (
    <section data-testid="page-properties">
      <h1>Properties</h1>
      <ul data-testid="property-list">
        {properties.map((p) => (
          <li key={p.id} data-testid={`property-${p.id}`}>
            <span data-testid={`property-${p.id}-address`}>{p.address}</span>
            <span data-testid={`property-${p.id}-leads`}>{leadCount(p.id)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
