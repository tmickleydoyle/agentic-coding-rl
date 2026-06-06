'use client'
import React from 'react';
import { AppStateProvider, useApp } from '../components/AppStateProvider';
import { NavBar } from '../components/NavBar';
import { HomePage } from '../app/home/page';
import { CertificatesPage } from '../app/certificates/page';
import { SkillsPage } from '../app/skills/page';
import { IssuedPage } from '../app/issued/page';
function Shell() {
  const { route } = useApp();
  const pages: Record<string, React.ReactElement> = { home: <HomePage />, certificates: <CertificatesPage />, skills: <SkillsPage />, issued: <IssuedPage /> };
  return <div data-theme="light"><NavBar />{pages[route] ?? <HomePage />}</div>;
}
export default function App() { return <AppStateProvider><Shell /></AppStateProvider>; }
