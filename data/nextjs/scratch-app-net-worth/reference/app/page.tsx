import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { SummaryPage } from "./summary/page";
import { AssetsPage } from "./assets/page";
import { LiabilitiesPage } from "./liabilities/page";
import { HistoryPage } from "./history/page";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app">
      <NavBar />
      <main data-testid="main-content">
        {route === "summary" && <SummaryPage />}
        {route === "assets" && <AssetsPage />}
        {route === "liabilities" && <LiabilitiesPage />}
        {route === "history" && <HistoryPage />}
      </main>
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
