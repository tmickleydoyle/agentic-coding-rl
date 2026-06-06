import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import DashboardPage from "./dashboard/page";
import RunwayPage from "./runway/page";
import ExpensesPage from "./expenses/page";
import ProjectionsPage from "./projections/page";
import SettingsPage from "./settings/page";

function Shell() {
  const { route } = useApp();

  let content: React.ReactNode;
  if (route === "/") content = <DashboardPage />;
  else if (route === "/runway") content = <RunwayPage />;
  else if (route === "/expenses") content = <ExpensesPage />;
  else if (route === "/projections") content = <ProjectionsPage />;
  else if (route === "/settings") content = <SettingsPage />;
  else content = <div data-testid="not-found">404 Not Found</div>;

  return (
    <div data-testid="app-shell">
      <NavBar />
      <main data-testid="main-content">{content}</main>
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
