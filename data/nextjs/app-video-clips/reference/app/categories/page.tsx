'use client'
import { useApp } from '../../components/AppStateProvider'
import { categoryCounts } from '../../hooks/useClips'
import CategoryRow from '../../components/CategoryRow'

export default function CategoriesPage() {
  const { clips, setCategory, navigate } = useApp()
  const groups = categoryCounts(clips)

  const onFilter = (category: string) => {
    setCategory(category)
    navigate('feed')
  }

  return (
    <section data-testid="page-categories">
      <h1>Categories</h1>
      <ul data-testid="category-list">
        {groups.map((g) => (
          <CategoryRow
            key={g.category}
            category={g.category}
            count={g.count}
            onFilter={onFilter}
          />
        ))}
      </ul>
    </section>
  )
}
