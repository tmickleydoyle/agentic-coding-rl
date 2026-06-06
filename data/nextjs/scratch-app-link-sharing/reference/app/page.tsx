'use client';
import React from 'react';
import { AppStateProvider, useApp } from '../components/AppStateProvider';
import { NavBar } from '../components/NavBar';
import { HomePage } from './home/page';
import { LinksPage } from './links/page';
import { SubmitPage } from './submit/page';
import { ProfilePage } from './profile/page';

function Shell() {
  const { route } = useApp();
  const pages: Record<string, React.ReactElement> = {
    home: <HomePage />, links: <LinksPage />, submit: <SubmitPage />, profile: <ProfilePage />,
  };
  return (
    <div data-theme="light">
      <NavBar />
      {pages[route] ?? <HomePage />}
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
