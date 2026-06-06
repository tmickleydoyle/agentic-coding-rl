"use client";
import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import SubscriptionsPage from "./subscriptions/page";
import EpisodesPage from "./episodes/page";
import HistoryPage from "./history/page";

function HomePage() {
  const { podcasts } = useApp();
  const unplayed = podcasts.flatMap((p) => p.episodes).filter((e) => !e.played).length;
  return (
    <div data-testid="home-page">
      <h1>Podcast Tracker</h1>
      <p data-testid="subscription-count">Subscriptions: {podcasts.length}</p>
      <p data-testid="unplayed-count">Unplayed episodes: {unplayed}</p>
    </div>
  );
}

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "/" && <HomePage />}
      {route === "/subscriptions" && <SubscriptionsPage />}
      {route === "/episodes" && <EpisodesPage />}
      {route === "/history" && <HistoryPage />}
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
