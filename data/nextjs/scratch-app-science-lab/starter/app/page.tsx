import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      <main data-testid="main-content">
        {route === "home" && <div data-testid="home-page"><h1>Science Lab</h1></div>}
        {route === "experiments" && <div data-testid="experiments-page"><h2>Experiments</h2></div>}
        {route === "equipment" && <div data-testid="equipment-page"><h2>Lab Equipment</h2></div>}
        {route === "results" && <div data-testid="results-page"><h2>Lab Results</h2></div>}
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
