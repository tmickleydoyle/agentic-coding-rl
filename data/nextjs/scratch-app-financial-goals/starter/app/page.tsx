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
          <span data-testid="total-goals">0</span>
          <span data-testid="completed-goals">0</span>
          <span data-testid="total-target">$0.00</span>
          <span data-testid="total-saved">$0.00</span>
        </div>
      </main>
    </div>
  );
}
export default function App() { return <AppStateProvider><Shell /></AppStateProvider>; }
