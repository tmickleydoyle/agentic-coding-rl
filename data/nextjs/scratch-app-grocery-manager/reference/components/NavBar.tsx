import React from "react";
import { useApp } from "./AppStateProvider";

export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav>
      <button data-testid="nav-shopping-list" onClick={() => navigate("shopping-list")}>Shopping List</button>
      <button data-testid="nav-add-item" onClick={() => navigate("add-item")}>Add Item</button>
      <button data-testid="nav-categories" onClick={() => navigate("categories")}>Categories</button>
    </nav>
  );
}
