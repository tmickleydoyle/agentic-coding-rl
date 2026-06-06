import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { MilestonesPage } from "./milestones/page";
import { ApplicationsPage } from "./applications/page";
import { SkillsPage } from "./skills/page";

function Dashboard() {
  return (
    <div data-testid="dashboard-page">
      <h2>Career Goals Dashboard</h2>
      <div data-testid="active-milestones">0</div>
      <div data-testid="pending-applications">0</div>
      <div data-testid="milestone-pct">0%</div>
    </div>
  );
}

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "dashboard" && <Dashboard />}
      {route === "milestones" && <MilestonesPage />}
      {route === "applications" && <ApplicationsPage />}
      {route === "skills" && <SkillsPage />}
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
