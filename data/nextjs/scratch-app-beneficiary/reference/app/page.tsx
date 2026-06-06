import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { ProfilesPage } from "./profiles/page";
import { AllocationsPage } from "./allocations/page";
import { ReportPage } from "./report/page";

function Shell() {
  const { route } = useApp();
  let content: React.ReactNode;
  if (route === "/allocations") content = <AllocationsPage />;
  else if (route === "/report") content = <ReportPage />;
  else content = <ProfilesPage />;
  return (
    <div data-testid="app-shell">
      <NavBar />
      {content}
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
