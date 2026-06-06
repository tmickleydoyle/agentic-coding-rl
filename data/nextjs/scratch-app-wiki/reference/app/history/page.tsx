'use client';
import React, { useEffect, useState } from 'react';
import { Article } from '../../lib/types';
import { useApp } from '../../components/AppStateProvider';

export function HistoryPage() {
  const { selectedArticleId } = useApp();
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    if (selectedArticleId) {
      fetch(`/api/articles/${selectedArticleId}`).then((r) => r.json()).then((d) => setArticle(d.article ?? null));
    }
  }, [selectedArticleId]);

  if (!article) return <div data-testid="history-page"><p>No article selected.</p></div>;

  return (
    <div data-testid="history-page">
      <h1 data-testid="history-title">{article.title}</h1>
      <p data-testid="history-body">{article.body}</p>
      <div data-testid="revisions-list">
        {article.revisions.map((r) => (
          <div key={r.id} data-testid={`revision-${r.id}`}>
            <span data-testid={`revision-editor-${r.id}`}>{r.editedBy}</span>
            <span data-testid={`revision-date-${r.id}`}>{r.editedAt}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
