import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { HomePage } from "./home/page";
import { ExpensesPage } from "./expenses/page";
import { IncomePage } from "./income/page";
import { ReportsPage } from "./reports/page";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app">
      <NavBar />
      <main data-testid="main-content">
        {route === "home" && <HomePage />}
        {route === "expenses" && <ExpensesPage />}
        {route === "income" && <IncomePage />}
        {route === "reports" && <ReportsPage />}
      </main>
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
