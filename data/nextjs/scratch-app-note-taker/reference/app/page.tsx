'use client';
import React from 'react';
import { AppStateProvider, useApp } from '../components/AppStateProvider';
import { NavBar } from '../components/NavBar';
import { HomePage } from '../app/home/page';
import { NotesPage } from '../app/notes/page';
import { TagsPage } from '../app/tags/page';
import { ArchivePage } from '../app/archive/page';

function Shell() {
  const { route } = useApp();
  const pages: Record<string, React.ReactElement> = {
    home: <HomePage />, notes: <NotesPage />, tags: <TagsPage />, archive: <ArchivePage />,
  };
  return <div data-theme="light"><NavBar />{pages[route] ?? <HomePage />}</div>;
}

export default function App() { return <AppStateProvider><Shell /></AppStateProvider>; }
