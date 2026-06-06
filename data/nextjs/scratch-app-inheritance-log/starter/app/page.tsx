import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { EntriesPage } from "./entries/page";
import { HeirsPage } from "./heirs/page";
import { TimelinePage } from "./timeline/page";

function Shell() {
  const { route } = useApp();
  let content: React.ReactNode;
  if (route === "/heirs") content = <HeirsPage />;
  else if (route === "/timeline") content = <TimelinePage />;
  else content = <EntriesPage />;
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
