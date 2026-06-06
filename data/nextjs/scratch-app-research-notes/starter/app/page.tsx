import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { ResearchPage } from "./research/page";
import { SourcesPage } from "./sources/page";
import { TagsPage } from "./tags/page";
import { SearchPage } from "./search/page";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      <main data-testid="main-content">
        {route === "research" && <ResearchPage />}
        {route === "sources" && <SourcesPage />}
        {route === "tags" && <TagsPage />}
        {route === "search" && <SearchPage />}
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
