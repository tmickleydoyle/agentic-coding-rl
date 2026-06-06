import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { RequestsPage } from "./requests/page";
import { OffersPage } from "./offers/page";
import { MatchesPage } from "./matches/page";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "requests" && <RequestsPage />}
      {route === "offers" && <OffersPage />}
      {route === "matches" && <MatchesPage />}
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
