"use client";
import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import ReadingListPage from "./reading-list/page";
import StatsPage from "./stats/page";
import DiscoverPage from "./discover/page";

function HomePage() {
  const { books } = useApp();
  const reading = books.filter((b) => b.status === "reading");
  const read = books.filter((b) => b.status === "read");
  return (
    <div data-testid="home-page">
      <h1>Reading Club</h1>
      <p data-testid="currently-reading-count">Currently reading: {reading.length}</p>
      <p data-testid="books-read-count">Books read: {read.length}</p>
    </div>
  );
}

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "/" && <HomePage />}
      {route === "/reading-list" && <ReadingListPage />}
      {route === "/stats" && <StatsPage />}
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
