import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { MeetingsPage } from "./meetings/page";
import { AgendaPage } from "./agenda/page";
import { SearchPage } from "./search/page";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      <main data-testid="main-content">
        {route === "meetings" && <MeetingsPage />}
        {route === "agenda" && <AgendaPage />}
        {route === "search" && <SearchPage />}
      </main>
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
