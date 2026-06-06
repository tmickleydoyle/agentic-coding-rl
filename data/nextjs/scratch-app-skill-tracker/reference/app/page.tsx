import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { SkillsPage } from "./skills/page";
import { ProgressPage } from "./progress/page";
import { ResourcesPage } from "./resources/page";
import { getSkills, getEntries } from "../lib/store";

function Dashboard() {
  const skills = getSkills();
  const entries = getEntries();
  const totalHours = entries.reduce((sum, e) => sum + e.hoursLogged, 0);
  const advanced = skills.filter((s) => s.level === "advanced").length;

  return (
    <div data-testid="dashboard-page">
      <h2>Skill Tracker Dashboard</h2>
      <div data-testid="skill-count">{skills.length}</div>
      <div data-testid="hours-this-week">{totalHours}</div>
      <div data-testid="advanced-count">{advanced}</div>
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
