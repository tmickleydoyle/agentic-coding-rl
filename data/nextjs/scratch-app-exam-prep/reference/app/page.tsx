import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import ExamsPage from "./exams/page";
import PracticePage from "./practice/page";
import ResultsPage from "./results/page";

function Shell() {
  const { route, exams, results } = useApp();
  const upcoming = exams.filter(e => e.status === "upcoming").length;
  return (
    <div data-testid="app-shell">
      <NavBar />
      <main data-testid="main-content">
        {route === "home" && (
          <div data-testid="home-page">
            <h1>Exam Prep</h1>
            <div data-testid="stat-exams">{exams.length} exams</div>
            <div data-testid="stat-upcoming">{upcoming} upcoming</div>
            <div data-testid="stat-results">{results.length} practice results</div>
          </div>
        )}
        {route === "exams" && <ExamsPage />}
        {route === "practice" && <PracticePage />}
        {route === "results" && <ResultsPage />}
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
