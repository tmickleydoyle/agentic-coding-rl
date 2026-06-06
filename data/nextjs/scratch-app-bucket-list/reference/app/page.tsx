"use client";
import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import GoalsPage from "./goals/page";
import CompletedPage from "./completed/page";
import CategoriesPage from "./categories/page";

function HomePage() {
  const { goals } = useApp();
  const completed = goals.filter((g) => g.completed);
  const pct = goals.length > 0 ? Math.round((completed.length / goals.length) * 100) : 0;
  return (
    <div data-testid="home-page">
      <h1>Bucket List</h1>
      <p data-testid="total-goals">Total goals: {goals.length}</p>
      <p data-testid="completed-goals">Completed: {completed.length}</p>
      <p data-testid="completion-pct">Progress: {pct}%</p>
    </div>
  );
}

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "/" && <HomePage />}
      {route === "/goals" && <GoalsPage />}
      {route === "/completed" && <CompletedPage />}
      {route === "/categories" && <CategoriesPage />}
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
