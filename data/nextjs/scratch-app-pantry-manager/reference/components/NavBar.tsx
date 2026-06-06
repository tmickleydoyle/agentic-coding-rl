import React from "react";
import { useApp } from "./AppStateProvider";

export function NavBar() {
  const { navigate, lowStock } = useApp();
  return (
    <nav>
      <button data-testid="nav-inventory" onClick={() => navigate("inventory")}>Inventory</button>
      <button data-testid="nav-add-item" onClick={() => navigate("add-item")}>Add Item</button>
      <button data-testid="nav-low-stock" onClick={() => navigate("low-stock")}>
        Low Stock <span data-testid="low-stock-count">{lowStock.length}</span>
      </button>
    </nav>
  );
}
