import React from "react";
import { useApp } from "../../components/AppStateProvider";
import { PantryItem } from "../../lib/types";

export function LowStockPage() {
  const { lowStock } = useApp();
  return (
    <div>
      <h1>Low Stock Items</h1>
      {lowStock.length === 0 ? (
        <p>All items are well stocked.</p>
      ) : (
        lowStock.map((item: PantryItem) => (
          <div key={item.id} data-testid="low-stock-item">
            {item.name}: {item.quantity} {item.unit} (threshold: {item.threshold})
          </div>
        ))
      )}
    </div>
  );
}
