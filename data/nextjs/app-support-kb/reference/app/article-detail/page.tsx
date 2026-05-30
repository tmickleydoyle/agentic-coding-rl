'use client'
import { useApp } from '../../components/AppStateProvider'

export default function ArticleDetailPage() {
  const { articles, selectedArticleId, voteHelpful, voteNotHelpful } = useApp()
  const article = selectedArticleId
    ? articles.find((a) => a.id === selectedArticleId)
    : undefined

  if (!article) {
    return (
      <section data-testid="page-article-detail">
        <p data-testid="no-selection">No article selected.</p>
      </section>
    )
  }

  return (
    <section data-testid="page-article-detail">
      <h1 data-testid="detail-title">{article.title}</h1>
      <p data-testid="detail-category">{article.category}</p>
      <p data-testid="detail-body">{article.body}</p>
      <p data-testid="detail-helpful">{article.helpful}</p>
      <p data-testid="detail-not-helpful">{article.notHelpful}</p>
      <button data-testid="vote-helpful" onClick={() => voteHelpful(article.id)}>
        Helpful
      </button>
      <button data-testid="vote-not-helpful" onClick={() => voteNotHelpful(article.id)}>
        Not helpful
      </button>
    </section>
  )
}
