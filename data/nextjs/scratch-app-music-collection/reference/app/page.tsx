"use client";
import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import LibraryPage from "./library/page";
import PlaylistsPage from "./playlists/page";
import ArtistsPage from "./artists/page";

function HomePage() {
  const { albums, playlists } = useApp();
  return (
    <div data-testid="home-page">
      <h1>Music Collection</h1>
      <p data-testid="album-count">Albums: {albums.length}</p>
      <p data-testid="playlist-count">Playlists: {playlists.length}</p>
    </div>
  );
}

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "/" && <HomePage />}
      {route === "/library" && <LibraryPage />}
      {route === "/playlists" && <PlaylistsPage />}
      {route === "/artists" && <ArtistsPage />}
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
