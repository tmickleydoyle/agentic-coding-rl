import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { ViewPage } from "./view/page";
import { ManagePage } from "./manage/page";
import { FilterPage } from "./filter/page";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      <main data-testid="main-content">
        {route === "view" && <ViewPage />}
        {route === "manage" && <ManagePage />}
        {route === "filter" && <FilterPage />}
      </main>
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
