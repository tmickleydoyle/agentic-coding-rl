'use client'
import type { Article } from '../lib/types'

export default function ArticleRow({
  article,
  onOpen,
}: {
  article: Article
  onOpen: (id: string) => void
}) {
  return (
    <li data-testid={`article-${article.id}`} data-category={article.category}>
      <span data-testid={`article-${article.id}-title`}>{article.title}</span>
      <span data-testid={`article-${article.id}-category`}>{article.category}</span>
      <button data-testid={`open-${article.id}`} onClick={() => onOpen(article.id)}>
        Open
      </button>
    </li>
  )
}
