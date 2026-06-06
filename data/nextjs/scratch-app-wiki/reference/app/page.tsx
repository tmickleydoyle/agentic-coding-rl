'use client';
import React from 'react';
import { AppStateProvider, useApp } from '../components/AppStateProvider';
import { NavBar } from '../components/NavBar';
import { HomePage } from './home/page';
import { ArticlesPage } from './articles/page';
import { NewArticlePage } from './new-article/page';
import { HistoryPage } from './history/page';

function Shell() {
  const { route } = useApp();
  const pages: Record<string, React.ReactElement> = {
    home: <HomePage />,
    articles: <ArticlesPage />,
    'new-article': <NewArticlePage />,
    history: <HistoryPage />,
  };
  return (
    <div data-theme="light">
      <NavBar />
      {pages[route] ?? <HomePage />}
    </div>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <Shell />
    </AppStateProvider>
  );
}
