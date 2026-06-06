import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { MentorsPage } from "./mentors/page";
import { SessionsPage } from "./sessions/page";
import { GoalsPage } from "./goals/page";

function Dashboard() {
  return (
    <div data-testid="dashboard-page">
      <h2>Dashboard</h2>
      <div data-testid="mentor-count">0</div>
      <div data-testid="upcoming-count">0</div>
      <div data-testid="goals-progress">0/0 completed</div>
    </div>
  );
}

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "dashboard" && <Dashboard />}
      {route === "mentors" && <MentorsPage />}
      {route === "sessions" && <SessionsPage />}
      {route === "goals" && <GoalsPage />}
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
