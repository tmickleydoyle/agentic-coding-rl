import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import DashboardPage from "./dashboard/page";
import TransactionsPage from "./transactions/page";
import CategoriesPage from "./categories/page";
import ForecastPage from "./forecast/page";

function Shell() {
  const { route } = useApp();
  let content: React.ReactNode;
  if (route === "/") content = <DashboardPage />;
  else if (route === "/transactions") content = <TransactionsPage />;
  else if (route === "/categories") content = <CategoriesPage />;
  else if (route === "/forecast") content = <ForecastPage />;
  else content = <div data-testid="not-found">404</div>;

  return (
    <div data-testid="app-shell">
      <NavBar />
      <main data-testid="main-content">{content}</main>
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
