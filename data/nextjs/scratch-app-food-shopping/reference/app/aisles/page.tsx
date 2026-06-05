'use client'
import { useShoppingViews } from '../../hooks/useShoppingViews'
import AisleSection from '../../components/AisleSection'

export default function AislesPage() {
  const { groups } = useShoppingViews()
  return (
    <section data-testid="page-aisles">
      <h1>By Aisle</h1>
      {groups.length === 0 ? (
        <p data-testid="aisles-empty">No items.</p>
      ) : (
        <div data-testid="aisle-groups">
          {groups.map((g) => (
            <AisleSection key={g.aisle} group={g} />
          ))}
        </div>
      )}
    </section>
  )
}
