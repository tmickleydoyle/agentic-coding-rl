"use client";
import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { KeywordsPage } from "./keywords/page";
import { PagesPage } from "./pages/page";
import { BacklinksPage } from "./backlinks/page";
import { ReportsPage } from "./reports/page";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      <main>
        {route === "keywords" && <KeywordsPage />}
        {route === "pages" && <PagesPage />}
        {route === "backlinks" && <BacklinksPage />}
        {route === "reports" && <ReportsPage />}
      </main>
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
