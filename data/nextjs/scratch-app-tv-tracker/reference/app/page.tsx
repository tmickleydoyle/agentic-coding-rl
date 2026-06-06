"use client";
import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import WatchlistPage from "./watchlist/page";
import ProgressPage from "./progress/page";
import FavoritesPage from "./favorites/page";

function HomePage() {
  const { shows } = useApp();
  const watching = shows.filter((s) => s.status === "watching");
  const completed = shows.filter((s) => s.status === "completed");
  return (
    <div data-testid="home-page">
      <h1>TV Tracker</h1>
      <p data-testid="watching-count">Watching: {watching.length}</p>
      <p data-testid="completed-count">Completed: {completed.length}</p>
    </div>
  );
}

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "/" && <HomePage />}
      {route === "/watchlist" && <WatchlistPage />}
      {route === "/progress" && <ProgressPage />}
      {route === "/favorites" && <FavoritesPage />}
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
