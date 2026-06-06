import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { DashboardPage } from "./dashboard/page";
import { GoalsPage } from "./goals/page";
import { MilestonesPage } from "./milestones/page";
import { InsightsPage } from "./insights/page";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app">
      <NavBar />
      <main data-testid="main-content">
        {route === "dashboard" && <DashboardPage />}
        {route === "goals" && <GoalsPage />}
        {route === "milestones" && <MilestonesPage />}
        {route === "insights" && <InsightsPage />}
      </main>
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
