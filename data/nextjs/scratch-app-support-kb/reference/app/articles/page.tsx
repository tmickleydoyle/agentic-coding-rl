'use client'
import { useApp } from '../../components/AppStateProvider'
import { useArticles } from '../../hooks/useArticles'
import ArticleRow from '../../components/ArticleRow'
import type { CategoryFilter } from '../../lib/types'

export default function ArticlesPage() {
  const { categoryFilter, setCategoryFilter, selectArticle } = useApp()
  const { filtered, categories } = useArticles()
  return (
    <section data-testid="page-articles">
      <h1>Articles</h1>
      <select
        data-testid="category-filter"
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
      >
        <option value="all">All categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      {filtered.length === 0 ? (
        <p data-testid="empty-state">No articles in this category.</p>
      ) : (
        <ul data-testid="article-list">
          {filtered.map((a) => (
            <ArticleRow key={a.id} article={a} onOpen={selectArticle} />
          ))}
        </ul>
      )}
    </section>
  )
}
