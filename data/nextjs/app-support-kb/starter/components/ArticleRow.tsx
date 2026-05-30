'use client'
import type { Article } from '../lib/types'

export default function ArticleRow({
  article,
  onOpen,
}: {
  article: Article
  onOpen: (id: string) => void
}) {
  // TODO: render the article row with title/category and an open-<id> button
  void onOpen
  return <li data-testid={`article-${article.id}`} />
}
