import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import DashboardPage from "./dashboard/page";
import InvestorsPage from "./investors/page";
import InteractionsPage from "./interactions/page";
import PipelinePage from "./pipeline/page";

function Shell() {
  const { route } = useApp();

  let content: React.ReactNode;
  if (route === "/") content = <DashboardPage />;
  else if (route === "/investors") content = <InvestorsPage />;
  else if (route === "/interactions") content = <InteractionsPage />;
  else if (route === "/pipeline") content = <PipelinePage />;
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
