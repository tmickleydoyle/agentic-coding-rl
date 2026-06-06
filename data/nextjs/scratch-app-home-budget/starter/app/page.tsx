import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app">
      <NavBar />
      <main data-testid="main-content">
        <div data-testid="home-page">
          <div data-testid="summary">
            <span data-testid="total-income">$0.00</span>
            <span data-testid="total-expenses">$0.00</span>
            <span data-testid="balance">$0.00</span>
          </div>
          <ul data-testid="recent-expenses"></ul>
          <ul data-testid="recent-incomes"></ul>
        </div>
      </main>
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
