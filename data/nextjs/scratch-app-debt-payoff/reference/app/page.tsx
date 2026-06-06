import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { OverviewPage } from "./overview/page";
import { DebtsPage } from "./debts/page";
import { PaymentsPage } from "./payments/page";
import { StrategyPage } from "./strategy/page";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app">
      <NavBar />
      <main data-testid="main-content">
        {route === "overview" && <OverviewPage />}
        {route === "debts" && <DebtsPage />}
        {route === "payments" && <PaymentsPage />}
        {route === "strategy" && <StrategyPage />}
      </main>
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
