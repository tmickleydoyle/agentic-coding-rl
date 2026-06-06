'use client'
import React from 'react';
import { AppStateProvider, useApp } from '../components/AppStateProvider';
import { NavBar } from '../components/NavBar';
import { HomePage } from '../app/home/page';
import { CoursesPage } from '../app/courses/page';
import { ProfilePage } from '../app/profile/page';
import { ProgressPage } from '../app/progress/page';

function Shell() {
  const { route } = useApp();
  const pages: Record<string, React.ReactElement> = {
    home: <HomePage />,
    courses: <CoursesPage />,
    profile: <ProfilePage />,
    progress: <ProgressPage />,
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
