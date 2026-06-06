import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import DashboardPage from "./dashboard/page";
import ShareholdersPage from "./shareholders/page";
import RoundsPage from "./rounds/page";
import DilutionPage from "./dilution/page";

function Shell() {
  const { route } = useApp();
  let content: React.ReactNode;
  if (route === "/") content = <DashboardPage />;
  else if (route === "/shareholders") content = <ShareholdersPage />;
  else if (route === "/rounds") content = <RoundsPage />;
  else if (route === "/dilution") content = <DilutionPage />;
  else content = <div data-testid="not-found">404</div>;

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
