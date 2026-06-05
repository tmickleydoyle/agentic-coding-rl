'use client'
import { usePlanViews } from '../../hooks/usePlanViews'

export default function GroceryPage() {
  const { grocery } = usePlanViews()
  return (
    <section data-testid="page-grocery">
      <h1>Grocery</h1>
      {grocery.length === 0 ? (
        <p data-testid="grocery-empty">Nothing to buy.</p>
      ) : (
        <ul data-testid="grocery-list">
          {grocery.map((g) => (
            <li key={g.name} data-testid={`grocery-${g.name}`}>
              <span data-testid={`grocery-${g.name}-name`}>{g.name}</span>
              <span data-testid={`grocery-${g.name}-count`}>{g.count}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
