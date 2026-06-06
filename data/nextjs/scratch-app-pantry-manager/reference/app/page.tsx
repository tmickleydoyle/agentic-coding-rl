import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { InventoryPage } from "./inventory/page";
import { AddItemPage } from "./add-item/page";
import { LowStockPage } from "./low-stock/page";

function Shell() {
  const { route } = useApp();
  return (
    <div>
      <NavBar />
      {route === "inventory" && <InventoryPage />}
      {route === "add-item" && <AddItemPage />}
      {route === "low-stock" && <LowStockPage />}
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
