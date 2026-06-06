import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { DashboardPage } from "./dashboard/page";
import { GoalsPage } from "./goals/page";
import { ContributionsPage } from "./contributions/page";
import { ProgressPage } from "./progress/page";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app">
      <NavBar />
      <main data-testid="main-content">
        {route === "dashboard" && <DashboardPage />}
        {route === "goals" && <GoalsPage />}
        {route === "contributions" && <ContributionsPage />}
        {route === "progress" && <ProgressPage />}
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
