"use client";
import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import WatchlistPage from "./watchlist/page";
import ReviewsPage from "./reviews/page";
import DiscoverPage from "./discover/page";

function HomePage() {
  const { movies } = useApp();
  const watched = movies.filter((m) => m.status === "watched");
  const wantToWatch = movies.filter((m) => m.status === "want-to-watch");
  return (
    <div data-testid="home-page">
      <h1>Movie Club</h1>
      <p data-testid="movies-watched-count">Movies watched: {watched.length}</p>
      <p data-testid="want-to-watch-count">Want to watch: {wantToWatch.length}</p>
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
      {route === "/reviews" && <ReviewsPage />}
      {route === "/discover" && <DiscoverPage />}
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
