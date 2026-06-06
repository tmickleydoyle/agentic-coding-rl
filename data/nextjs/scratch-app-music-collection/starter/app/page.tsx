"use client";
import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";

function HomePage() {
  return (
    <div data-testid="home-page">
      <h1>Music Collection</h1>
      <p data-testid="album-count">Albums: 0</p>
      <p data-testid="playlist-count">Playlists: 0</p>
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
