'use client';
import React, { useEffect, useState } from 'react';
import { Article } from '../../lib/types';
import { useApp } from '../../components/AppStateProvider';

export function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [search, setSearch] = useState('');
  const { navigate, setSelectedArticleId } = useApp();

  useEffect(() => {
    fetch('/api/articles').then((r) => r.json()).then(setArticles);
  }, []);

  const filtered = articles.filter((a) => a.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div data-testid="articles-page">
      <h1>Articles</h1>
      <input data-testid="search-input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." />
      {filtered.length === 0 && <div data-testid="no-results">No articles found</div>}
      {filtered.map((a) => (
        <div key={a.id} data-testid={`article-row-${a.id}`}>
          <button data-testid={`article-link-${a.id}`} onClick={() => { setSelectedArticleId(a.id); navigate('history'); }}>
            {a.title}
          </button>
          <span data-testid={`article-author-${a.id}`}>{a.author}</span>
          <span data-testid={`article-tags-${a.id}`}>{a.tags.join(', ')}</span>
          <span data-testid={`article-updated-${a.id}`}>{a.updatedAt}</span>
        </div>
      ))}
    </div>
  );
}
