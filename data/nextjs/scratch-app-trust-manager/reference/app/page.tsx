import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { TrustsPage } from "./trusts/page";
import { DistributionsPage } from "./distributions/page";
import { OverviewPage } from "./overview/page";

function Shell() {
  const { route } = useApp();
  let content: React.ReactNode;
  if (route === "/distributions") content = <DistributionsPage />;
  else if (route === "/overview") content = <OverviewPage />;
  else content = <TrustsPage />;
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
