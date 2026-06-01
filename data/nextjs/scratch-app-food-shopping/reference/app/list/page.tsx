'use client'
import { useShopping } from '../../components/AppStateProvider'
import ItemRow from '../../components/ItemRow'

export default function ListPage() {
  const { items, toggleBought, removeItem, clearBought } = useShopping()
  return (
    <section data-testid="page-list">
      <h1>Shopping List</h1>
      <button data-testid="clear-bought" onClick={clearBought}>
        Clear bought
      </button>
      {items.length === 0 ? (
        <p data-testid="list-empty">Your list is empty.</p>
      ) : (
        <ul data-testid="item-list">
          {items.map((i) => (
            <ItemRow key={i.id} item={i} onToggle={toggleBought} onRemove={removeItem} />
          ))}
        </ul>
      )}
    </section>
  )
}
