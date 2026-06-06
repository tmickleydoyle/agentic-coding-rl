import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { DashboardPage } from "./dashboard/page";
import { AssetsPage } from "./assets/page";
import { BeneficiariesPage } from "./beneficiaries/page";
import { NotesPage } from "./notes/page";

function Shell() {
  const { route } = useApp();
  let content: React.ReactNode;
  if (route === "/assets") content = <AssetsPage />;
  else if (route === "/beneficiaries") content = <BeneficiariesPage />;
  else if (route === "/notes") content = <NotesPage />;
  else content = <DashboardPage />;
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
