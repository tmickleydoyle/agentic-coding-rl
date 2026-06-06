"use client";
import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { MatchesPage } from "./matches/page";
import { FlagsPage } from "./flags/page";
import { ReportsPage } from "./reports/page";
function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "matches" && <MatchesPage />}
      {route === "flags" && <FlagsPage />}
      {route === "reports" && <ReportsPage />}
    </div>
  );
}
export default function App() { return <AppStateProvider><Shell /></AppStateProvider>; }
