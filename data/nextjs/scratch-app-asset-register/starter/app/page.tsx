import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { RegisterPage } from "./register/page";
import { ValuationsPage } from "./valuations/page";
import { SummaryPage } from "./summary/page";

function Shell() {
  const { route } = useApp();
  let content: React.ReactNode;
  if (route === "/valuations") content = <ValuationsPage />;
  else if (route === "/summary") content = <SummaryPage />;
  else content = <RegisterPage />;
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
