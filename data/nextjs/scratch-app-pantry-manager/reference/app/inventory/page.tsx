import React from "react";
import { useApp } from "../../components/AppStateProvider";
import { PantryItem } from "../../lib/types";

export function InventoryPage() {
  const { items, handleUpdateQuantity, handleDelete } = useApp();
  return (
    <div>
      <h1>Pantry Inventory</h1>
      <p data-testid="total-items">{items.length} items</p>
      {items.map((item: PantryItem) => (
        <div key={item.id} data-testid="pantry-item">
          <span>{item.name} — {item.quantity} {item.unit}</span>
          <button data-testid={`increment-${item.id}`} onClick={() => handleUpdateQuantity(item.id, 1)}>+</button>
          <button data-testid={`decrement-${item.id}`} onClick={() => handleUpdateQuantity(item.id, -1)}>-</button>
          <button data-testid={`delete-btn-${item.id}`} onClick={() => handleDelete(item.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
