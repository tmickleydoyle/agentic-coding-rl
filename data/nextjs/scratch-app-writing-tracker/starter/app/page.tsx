"use client";
import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      <main>
        {route === "dashboard" && <div data-testid="dashboard-page"><h1>Dashboard</h1></div>}
        {route === "entries" && <div data-testid="entries-page"><h1>Entries</h1></div>}
        {route === "goals" && <div data-testid="goals-page"><h1>Goals</h1></div>}
        {route === "settings" && <div data-testid="settings-page"><h1>Settings</h1></div>}
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
