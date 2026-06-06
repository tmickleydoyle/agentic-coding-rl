import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import NavBar from "../components/NavBar";
import DashboardPage from "./dashboard/page";
import WorkoutsPage from "./workouts/page";
import SchedulePage from "./schedule/page";
import ProgressPage from "./progress/page";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "dashboard" && <DashboardPage />}
      {route === "workouts" && <WorkoutsPage />}
      {route === "schedule" && <SchedulePage />}
      {route === "progress" && <ProgressPage />}
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
