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
          <h1>Weather Log</h1>
          <p data-testid="total-entries">0 entries</p>
        </main>
      </div>
    </AppStateProvider>
  );
}
