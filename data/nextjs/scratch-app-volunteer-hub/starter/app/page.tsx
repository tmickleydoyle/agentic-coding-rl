import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { VolunteersPage } from "./volunteers/page";
import { AssignmentsPage } from "./assignments/page";
import { ReportsPage } from "./reports/page";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "volunteers" && <VolunteersPage />}
      {route === "assignments" && <AssignmentsPage />}
      {route === "reports" && <ReportsPage />}
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
