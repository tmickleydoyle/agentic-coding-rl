'use client'
import type { Service } from '../lib/types'

export default function ServiceCard({
  service,
  onSelect,
}: {
  service: Service
  onSelect: (id: string) => void
}) {
  return (
    <li data-testid={`service-${service.id}`}>
      <span data-testid={`service-${service.id}-name`}>{service.name}</span>
      <span data-testid={`service-${service.id}-duration`}>{service.durationMin}</span>
      <button data-testid={`select-${service.id}`} onClick={() => onSelect(service.id)}>
        Select
      </button>
    </li>
  )
}
