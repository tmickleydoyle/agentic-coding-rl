import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app">
      <NavBar />
      <main data-testid="main-content">
        <div data-testid="portfolio-page">
          <span data-testid="total-invested">$0.00</span>
          <span data-testid="current-value">$0.00</span>
          <span data-testid="gain-loss">$0.00</span>
        </div>
      </main>
    </div>
  );
}
export default function App() { return <AppStateProvider><Shell /></AppStateProvider>; }
