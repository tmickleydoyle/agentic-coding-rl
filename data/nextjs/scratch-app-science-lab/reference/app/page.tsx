import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import ExperimentsPage from "./experiments/page";
import EquipmentPage from "./equipment/page";
import ResultsPage from "./results/page";

function Shell() {
  const { route, experiments, equipment, results } = useApp();
  const running = experiments.filter(e => e.status === "running").length;
  const available = equipment.filter(eq => eq.status === "available").length;
  return (
    <div data-testid="app-shell">
      <NavBar />
      <main data-testid="main-content">
        {route === "home" && (
          <div data-testid="home-page">
            <h1>Science Lab</h1>
            <div data-testid="stat-experiments">{experiments.length} experiments</div>
            <div data-testid="stat-running">{running} running</div>
            <div data-testid="stat-equipment">{available} equipment available</div>
            <div data-testid="stat-results">{results.length} measurements</div>
          </div>
        )}
        {route === "experiments" && <ExperimentsPage />}
        {route === "equipment" && <EquipmentPage />}
        {route === "results" && <ResultsPage />}
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
