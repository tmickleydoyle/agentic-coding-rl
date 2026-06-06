import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { ClausesPage } from "./clauses/page";
import { WitnessesPage } from "./witnesses/page";
import { SummaryPage } from "./summary/page";

function Shell() {
  const { route } = useApp();
  let content: React.ReactNode;
  if (route === "/witnesses") content = <WitnessesPage />;
  else if (route === "/summary") content = <SummaryPage />;
  else content = <ClausesPage />;
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
