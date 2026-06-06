"use client";
import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";

function HomePage() {
  return (
    <div data-testid="home-page">
      <h1>Bucket List</h1>
      <p data-testid="total-goals">Total goals: 0</p>
      <p data-testid="completed-goals">Completed: 0</p>
      <p data-testid="completion-pct">Progress: 0%</p>
    </div>
  );
}

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "/" && <HomePage />}
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
