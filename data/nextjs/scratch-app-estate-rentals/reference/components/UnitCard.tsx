'use client'
import type { Unit } from '../lib/types'

export default function UnitCard({
  unit,
  onToggle,
  onOpen,
}: {
  unit: Unit
  onToggle: (id: string) => void
  onOpen: (id: string) => void
}) {
  return (
    <li data-testid={`unit-${unit.id}`} data-occupied={unit.occupied ? 'true' : 'false'}>
      <span data-testid={`unit-${unit.id}-label`}>{unit.label}</span>
      <span data-testid={`unit-${unit.id}-rent`}>{unit.rent}</span>
      <span data-testid={`occupied-${unit.id}`}>{unit.occupied ? 'Occupied' : 'Vacant'}</span>
      <button data-testid={`toggle-${unit.id}`} onClick={() => onToggle(unit.id)}>
        {unit.occupied ? 'Mark vacant' : 'Mark occupied'}
      </button>
      <button data-testid={`open-${unit.id}`} onClick={() => onOpen(unit.id)}>
        Open
      </button>
    </li>
  )
}
