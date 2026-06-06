'use client'
import React from 'react';
import { AppStateProvider, useApp } from '../components/AppStateProvider';
import { NavBar } from '../components/NavBar';
import { HomePage } from '../app/home/page';
import { ModulesPage } from '../app/modules/page';
import { LessonsPage } from '../app/lessons/page';
import { PreviewPage } from '../app/preview/page';
function Shell() {
  const { route } = useApp();
  const pages: Record<string, React.ReactElement> = { home: <HomePage />, modules: <ModulesPage />, lessons: <LessonsPage />, preview: <PreviewPage /> };
  return <div data-theme="light"><NavBar />{pages[route] ?? <HomePage />}</div>;
}
export default function App() { return <AppStateProvider><Shell /></AppStateProvider>; }
