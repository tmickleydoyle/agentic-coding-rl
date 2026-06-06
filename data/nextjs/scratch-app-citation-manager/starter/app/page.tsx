import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { CitationsPage } from "./citations/page";
import { CollectionsPage } from "./collections/page";
import { ExportPage } from "./export/page";
import { SearchPage } from "./search/page";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      <main data-testid="main-content">
        {route === "citations" && <CitationsPage />}
        {route === "collections" && <CollectionsPage />}
        {route === "export" && <ExportPage />}
        {route === "search" && <SearchPage />}
      </main>
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
