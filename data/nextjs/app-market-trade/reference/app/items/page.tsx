'use client'
import { useApp } from '../../components/AppStateProvider'
import ItemRow from '../../components/ItemRow'

export default function ItemsPage() {
  const { items, select } = useApp()
  return (
    <section data-testid="page-items">
      <h1>Items</h1>
      {items.length === 0 ? (
        <p data-testid="no-items">No items available.</p>
      ) : (
        <ul data-testid="item-list">
          {items.map((i) => (
            <ItemRow key={i.id} item={i} onView={select} />
          ))}
        </ul>
      )}
    </section>
  )
}
