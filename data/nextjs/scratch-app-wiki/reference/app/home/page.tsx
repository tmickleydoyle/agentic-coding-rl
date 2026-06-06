'use client';
import React, { useEffect, useState } from 'react';
import { Article } from '../../lib/types';

export function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetch('/api/articles').then((r) => r.json()).then(setArticles);
  }, []);

  const recent = articles.slice(0, 3);

  return (
    <div data-testid="home-page">
      <h1>Wiki</h1>
      <div data-testid="stat-articles">Articles: {articles.length}</div>
      <div data-testid="recent-list">
        {recent.map((a) => (
          <div key={a.id} data-testid={`recent-article-${a.id}`}>{a.title}</div>
        ))}
      </div>
    </div>
  );
}
