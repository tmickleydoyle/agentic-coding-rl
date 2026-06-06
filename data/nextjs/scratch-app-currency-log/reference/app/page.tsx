import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import NavBar from "../components/NavBar";
import LogPage from "./log/page";
import AddExchangePage from "./add-exchange/page";
import SummaryPage from "./summary/page";

function Shell() {
  const { route, exchanges } = useApp();
  const totalFees = exchanges.reduce((s, e) => s + e.fee, 0).toFixed(2);

  let content: React.ReactNode;
  if (route === "/log") content = <LogPage />;
  else if (route === "/add-exchange") content = <AddExchangePage />;
  else if (route === "/summary") content = <SummaryPage />;
  else content = (
    <div data-testid="home-page">
      <h1>Currency Log</h1>
      <p data-testid="home-exchange-count">{exchanges.length}</p>
      <p data-testid="home-total-fees">{totalFees}</p>
    </div>
  );

  return (
    <div>
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
