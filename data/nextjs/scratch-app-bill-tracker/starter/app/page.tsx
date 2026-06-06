import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app">
      <NavBar />
      <main data-testid="main-content">
        <div data-testid="dashboard-page">
          <span data-testid="total-monthly">$0.00</span>
          <span data-testid="active-count">0</span>
          <span data-testid="due-soon-count">0</span>
          <ul data-testid="due-soon-list"></ul>
        </div>
      </main>
    </div>
  );
}
export default function App() { return <AppStateProvider><Shell /></AppStateProvider>; }
