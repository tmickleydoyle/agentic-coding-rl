"use client";
import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import CollectionPage from "./collection/page";
import WishlistPage from "./wishlist/page";
import StatsPage from "./stats/page";

function HomePage() {
  const { games } = useApp();
  const owned = games.filter((g) => g.status !== "wishlist");
  const playing = games.filter((g) => g.status === "playing");
  return (
    <div data-testid="home-page">
      <h1>Game Library</h1>
      <p data-testid="owned-count">Owned games: {owned.length}</p>
      <p data-testid="playing-count">Currently playing: {playing.length}</p>
    </div>
  );
}

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "/" && <HomePage />}
      {route === "/collection" && <CollectionPage />}
      {route === "/wishlist" && <WishlistPage />}
      {route === "/stats" && <StatsPage />}
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
