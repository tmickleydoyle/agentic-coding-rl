'use client'
import type { House } from '../lib/types'

export default function HouseCard({
  house,
  visitorCount,
  onOpen,
}: {
  house: House
  visitorCount: number
  onOpen: (id: string) => void
}) {
  return (
    <li data-testid={`house-${house.id}`}>
      <span data-testid={`house-${house.id}-address`}>{house.address}</span>
      <span data-testid={`house-${house.id}-time`}>{house.time}</span>
      <span data-testid={`house-${house.id}-count`}>{visitorCount}</span>
      <button data-testid={`open-${house.id}`} onClick={() => onOpen(house.id)}>
        Open
      </button>
    </li>
  )
}
