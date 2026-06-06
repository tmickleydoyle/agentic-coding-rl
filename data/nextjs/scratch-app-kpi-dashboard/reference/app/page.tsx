import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import OverviewPage from "./overview/page";
import MetricsPage from "./metrics/page";
import GoalsPage from "./goals/page";
import HistoryPage from "./history/page";

function Shell() {
  const { route } = useApp();
  let content: React.ReactNode;
  if (route === "/") content = <OverviewPage />;
  else if (route === "/metrics") content = <MetricsPage />;
  else if (route === "/goals") content = <GoalsPage />;
  else if (route === "/history") content = <HistoryPage />;
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
