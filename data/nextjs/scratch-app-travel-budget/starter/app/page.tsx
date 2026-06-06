import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import NavBar from "../components/NavBar";

function Shell() {
  const { route, budget } = useApp();
  return (
    <div>
      <NavBar />
      {route === "/" && (
        <div data-testid="home-page">
          <h1>{budget.tripName}</h1>
          <p data-testid="home-total-budget">{budget.totalBudget}</p>
          <p data-testid="home-total-spent">0</p>
          <p data-testid="home-remaining">{budget.totalBudget}</p>
          <p data-testid="home-percent-used">0.0%</p>
        </div>
      )}
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
