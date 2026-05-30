'use client'
import { useRentals } from '../../hooks/useRentals'

export default function OccupancyPage() {
  const { occupancyRate, occupiedCount, vacantCount, pendingCount } = useRentals()
  return (
    <section data-testid="page-occupancy">
      <h1>Occupancy</h1>
      <p data-testid="occupancy-rate">{occupancyRate}%</p>
      <p data-testid="occupied-count">{occupiedCount}</p>
      <p data-testid="vacant-count">{vacantCount}</p>
      <p data-testid="pending-count">{pendingCount}</p>
    </section>
  )
}
