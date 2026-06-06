import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { MilestonesPage } from "./milestones/page";
import { ApplicationsPage } from "./applications/page";
import { SkillsPage } from "./skills/page";
import { getMilestones, getApplications } from "../lib/store";

function Dashboard() {
  const milestones = getMilestones();
  const applications = getApplications();
  const active = milestones.filter((m) => !m.completed).length;
  const pending = applications.filter((a) => a.status === "applied" || a.status === "interview").length;
  const completed = milestones.filter((m) => m.completed).length;
  const pct = milestones.length > 0 ? Math.round((completed / milestones.length) * 100) : 0;

  return (
    <div data-testid="dashboard-page">
      <h2>Career Goals Dashboard</h2>
      <div data-testid="active-milestones">{active}</div>
      <div data-testid="pending-applications">{pending}</div>
      <div data-testid="milestone-pct">{pct}%</div>
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
