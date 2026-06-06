import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      <main data-testid="main-content">
        {route === "home" && <div data-testid="home-page"><h1>Exam Prep</h1></div>}
        {route === "exams" && <div data-testid="exams-page"><h2>Exams</h2></div>}
        {route === "practice" && <div data-testid="practice-page"><h2>Practice</h2></div>}
        {route === "results" && <div data-testid="results-page"><h2>My Results</h2></div>}
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
