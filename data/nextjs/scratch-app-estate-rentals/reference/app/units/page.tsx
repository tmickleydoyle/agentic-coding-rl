'use client'
import { useApp } from '../../components/AppStateProvider'
import UnitCard from '../../components/UnitCard'

export default function UnitsPage() {
  const { units, toggleOccupied, selectUnit, navigate } = useApp()

  const open = (id: string) => {
    selectUnit(id)
    navigate('unit-detail')
  }

  return (
    <section data-testid="page-units">
      <h1>Units</h1>
      <ul data-testid="unit-list">
        {units.map((u) => (
          <UnitCard key={u.id} unit={u} onToggle={toggleOccupied} onOpen={open} />
        ))}
      </ul>
    </section>
  )
}
