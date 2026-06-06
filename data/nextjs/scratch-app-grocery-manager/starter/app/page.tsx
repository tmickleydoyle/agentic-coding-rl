import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { ShoppingListPage } from "./shopping-list/page";
import { AddItemPage } from "./add-item/page";
import { CategoriesPage } from "./categories/page";

function Shell() {
  const { route } = useApp();
  return (
    <div>
      <NavBar />
      {route === "shopping-list" && <ShoppingListPage />}
      {route === "add-item" && <AddItemPage />}
      {route === "categories" && <CategoriesPage />}
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
