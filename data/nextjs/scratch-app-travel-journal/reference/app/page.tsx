import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import NavBar from "../components/NavBar";
import JournalPage from "./journal/page";
import NewEntryPage from "./new-entry/page";
import StatsPage from "./stats/page";

function Shell() {
  const { route, entries } = useApp();
  const countries = Array.from(new Set(entries.map((e) => e.country))).length;

  let content: React.ReactNode;
  if (route === "/journal") content = <JournalPage />;
  else if (route === "/new-entry") content = <NewEntryPage />;
  else if (route === "/stats") content = <StatsPage />;
  else content = (
    <div data-testid="home-page">
      <h1>Travel Journal</h1>
      <p data-testid="home-entry-count">{entries.length}</p>
      <p data-testid="home-country-count">{countries}</p>
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
