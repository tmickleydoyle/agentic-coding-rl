'use client'
import React from 'react';
import { AppStateProvider } from '../components/AppStateProvider';
import { NavBar } from '../components/NavBar';

export default function App() {
  return (
    <AppStateProvider>
      <div data-testid="app" data-theme="light">
        <NavBar />
        <main data-testid="home-page">
          <h1>Typing Practice</h1>
          <p data-testid="personal-best">Personal Best: 0 WPM</p>
          <p data-testid="tests-taken">0 tests taken</p>
          <button data-testid="start-practice-btn">Start Practice</button>
        </main>
      </div>
    </AppStateProvider>
  );
}
