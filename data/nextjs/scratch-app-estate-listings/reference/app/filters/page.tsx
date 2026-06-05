'use client'
import { useEstate } from '../../components/AppStateProvider'
import Filters from '../../components/Filters'

export default function FiltersPage() {
  const {
    typeFilter,
    bedsFilter,
    maxPrice,
    setTypeFilter,
    setBedsFilter,
    setMaxPrice,
    theme,
    setTheme,
    navigate,
  } = useEstate()

  return (
    <section data-testid="page-filters">
      <h1>Filters</h1>
      <Filters
        typeFilter={typeFilter}
        bedsFilter={bedsFilter}
        maxPrice={maxPrice}
        onTypeChange={setTypeFilter}
        onBedsChange={setBedsFilter}
        onMaxPriceChange={setMaxPrice}
      />
      <p data-testid="current-theme">{theme}</p>
      <button
        data-testid="theme-toggle"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        Switch theme
      </button>
      <button data-testid="apply-filters" onClick={() => navigate('listings')}>
        View results
      </button>
    </section>
  )
}
