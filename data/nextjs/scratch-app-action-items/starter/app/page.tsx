import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { ItemsPage } from "./items/page";
import { CompletedPage } from "./completed/page";
import { FilterPage } from "./filter/page";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      <main data-testid="main-content">
        {route === "items" && <ItemsPage />}
        {route === "completed" && <CompletedPage />}
        {route === "filter" && <FilterPage />}
      </main>
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
