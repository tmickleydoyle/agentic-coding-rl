'use client';
import React from 'react';
import { AppStateProvider, useApp } from '../components/AppStateProvider';
import { NavBar } from '../components/NavBar';
import { HomePage } from './home/page';
import { ProposalsPage } from './proposals/page';
import { SubmitPage } from './submit/page';
import { LeaderboardPage } from './leaderboard/page';

function Shell() {
  const { route } = useApp();
  const pages: Record<string, React.ReactElement> = {
    home: <HomePage />, proposals: <ProposalsPage />, submit: <SubmitPage />, leaderboard: <LeaderboardPage />,
  };
  return <div data-theme="light"><NavBar />{pages[route] ?? <HomePage />}</div>;
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
