'use client'
import { useApp } from '../../components/AppStateProvider'
import { useOpenHouses } from '../../hooks/useOpenHouses'
import HouseCard from '../../components/HouseCard'

export default function SchedulePage() {
  const { houses, selectHouse, navigate } = useApp()
  const { visitorCount, totals } = useOpenHouses()

  const open = (id: string) => {
    selectHouse(id)
    navigate('house-detail')
  }

  return (
    <section data-testid="page-schedule">
      <h1>Schedule</h1>
      <p data-testid="total-visitors">{totals.visitors}</p>
      <ul data-testid="house-list">
        {houses.map((h) => (
          <HouseCard key={h.id} house={h} visitorCount={visitorCount(h)} onOpen={open} />
        ))}
      </ul>
    </section>
  )
}
