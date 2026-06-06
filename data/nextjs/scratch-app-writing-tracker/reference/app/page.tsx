"use client";
import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { DashboardPage } from "./dashboard/page";
import { EntriesPage } from "./entries/page";
import { GoalsPage } from "./goals/page";
import { SettingsPage } from "./settings/page";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      <main>
        {route === "dashboard" && <DashboardPage />}
        {route === "entries" && <EntriesPage />}
        {route === "goals" && <GoalsPage />}
        {route === "settings" && <SettingsPage />}
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
