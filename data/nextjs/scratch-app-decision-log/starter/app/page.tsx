import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { LogPage } from "./log/page";
import { ArchivePage } from "./archive/page";
import { FilterPage } from "./filter/page";
import { StatsPage } from "./stats/page";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      <main data-testid="main-content">
        {route === "log" && <LogPage />}
        {route === "archive" && <ArchivePage />}
        {route === "filter" && <FilterPage />}
        {route === "stats" && <StatsPage />}
      </main>
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
