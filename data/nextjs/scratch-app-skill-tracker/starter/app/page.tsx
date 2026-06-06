import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { SkillsPage } from "./skills/page";
import { ProgressPage } from "./progress/page";
import { ResourcesPage } from "./resources/page";

function Dashboard() {
  return (
    <div data-testid="dashboard-page">
      <h2>Skill Tracker Dashboard</h2>
      <div data-testid="skill-count">0</div>
      <div data-testid="hours-this-week">0</div>
      <div data-testid="advanced-count">0</div>
    </div>
  );
}

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "dashboard" && <Dashboard />}
      {route === "skills" && <SkillsPage />}
      {route === "progress" && <ProgressPage />}
      {route === "resources" && <ResourcesPage />}
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
