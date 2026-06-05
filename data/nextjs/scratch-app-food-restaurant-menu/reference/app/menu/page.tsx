'use client'
import { useMenu } from '../../components/AppStateProvider'
import { useMenuViews } from '../../hooks/useMenuViews'
import Filters from '../../components/Filters'
import DishCard from '../../components/DishCard'

export default function MenuPage() {
  const {
    categoryFilter,
    vegOnly,
    setCategoryFilter,
    setVegOnly,
    selectDish,
    addToCart,
  } = useMenu()
  const { categories, filtered } = useMenuViews()

  return (
    <section data-testid="page-menu">
      <h1>Menu</h1>
      <Filters
        categories={categories}
        categoryFilter={categoryFilter}
        vegOnly={vegOnly}
        onCategoryChange={setCategoryFilter}
        onVegOnlyChange={setVegOnly}
      />
      {filtered.length === 0 ? (
        <p data-testid="menu-empty">No dishes match.</p>
      ) : (
        <ul data-testid="dish-list">
          {filtered.map((d) => (
            <DishCard key={d.id} dish={d} onView={selectDish} onAdd={addToCart} />
          ))}
        </ul>
      )}
    </section>
  )
}
