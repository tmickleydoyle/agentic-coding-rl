"use client";
import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { StandingsPage } from "./standings/page";
import { TeamsPage } from "./teams/page";
import { SchedulePage } from "./schedule/page";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "standings" && <StandingsPage />}
      {route === "teams" && <TeamsPage />}
      {route === "schedule" && <SchedulePage />}
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
