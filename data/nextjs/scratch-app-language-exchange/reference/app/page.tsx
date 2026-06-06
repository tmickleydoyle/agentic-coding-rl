import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import LanguageExchangeHome from "./language-exchange/page";
import VocabularyPage from "./vocabulary/page";
import PartnersPage from "./partners/page";
import SessionsPage from "./sessions/page";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      <main data-testid="main-content">
        {route === "home" && <LanguageExchangeHome />}
        {route === "vocabulary" && <VocabularyPage />}
        {route === "partners" && <PartnersPage />}
        {route === "sessions" && <SessionsPage />}
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
