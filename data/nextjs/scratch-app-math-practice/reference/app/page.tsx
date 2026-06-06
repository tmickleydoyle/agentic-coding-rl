import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import ProblemsPage from "./problems/page";
import DrillsPage from "./drills/page";
import ScoresPage from "./scores/page";

function Shell() {
  const { route, problems, drills, scores } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      <main data-testid="main-content">
        {route === "home" && (
          <div data-testid="home-page">
            <h1>Math Practice</h1>
            <div data-testid="stat-problems">{problems.length} problems</div>
            <div data-testid="stat-drills">{drills.length} drills</div>
            <div data-testid="stat-scores">{scores.length} scores</div>
          </div>
        )}
        {route === "problems" && <ProblemsPage />}
        {route === "drills" && <DrillsPage />}
        {route === "scores" && <ScoresPage />}
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
