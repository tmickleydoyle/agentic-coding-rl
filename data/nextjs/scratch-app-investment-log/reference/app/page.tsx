import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { PortfolioPage } from "./portfolio/page";
import { HoldingsPage } from "./holdings/page";
import { TransactionsPage } from "./transactions/page";
import { PerformancePage } from "./performance/page";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app">
      <NavBar />
      <main data-testid="main-content">
        {route === "portfolio" && <PortfolioPage />}
        {route === "holdings" && <HoldingsPage />}
        {route === "transactions" && <TransactionsPage />}
        {route === "performance" && <PerformancePage />}
      </main>
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
