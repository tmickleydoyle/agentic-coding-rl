import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app">
      <NavBar />
      <main data-testid="main-content">
        <div data-testid="overview-page">
          <span data-testid="total-remaining">$0.00</span>
          <span data-testid="total-paid">$0.00</span>
          <span data-testid="debt-count">0</span>
        </div>
      </main>
    </div>
  );
}
export default function App() { return <AppStateProvider><Shell /></AppStateProvider>; }
