import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { ObjectivesPage } from "./objectives/page";
import { KeyResultsPage } from "./keyresults/page";
import { ProgressPage } from "./progress/page";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      <main data-testid="main-content">
        {route === "objectives" && <ObjectivesPage />}
        {route === "keyresults" && <KeyResultsPage />}
        {route === "progress" && <ProgressPage />}
      </main>
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
