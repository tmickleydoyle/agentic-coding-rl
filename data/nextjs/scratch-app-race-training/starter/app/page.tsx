import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import NavBar from "../components/NavBar";
import PlanPage from "./plan/page";
import RunsPage from "./runs/page";
import GoalsPage from "./goals/page";
import LogPage from "./log/page";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "plan" && <PlanPage />}
      {route === "runs" && <RunsPage />}
      {route === "goals" && <GoalsPage />}
      {route === "log" && <LogPage />}
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
