"use client";
import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import ItemsPage from "./items/page";
import CategoriesPage from "./categories/page";
import SharedPage from "./shared/page";

function HomePage() {
  const { items } = useApp();
  const unpurchased = items.filter((i) => !i.purchased);
  const totalCost = unpurchased.reduce((sum, i) => sum + i.price, 0);
  return (
    <div data-testid="home-page">
      <h1>Wishlist</h1>
      <p data-testid="item-count">Items: {items.length}</p>
      <p data-testid="total-cost">Estimated cost: ${totalCost.toFixed(2)}</p>
    </div>
  );
}

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "/" && <HomePage />}
      {route === "/items" && <ItemsPage />}
      {route === "/categories" && <CategoriesPage />}
      {route === "/shared" && <SharedPage />}
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
