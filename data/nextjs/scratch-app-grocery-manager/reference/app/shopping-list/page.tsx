import React from "react";
import { useApp } from "../../components/AppStateProvider";
import { GroceryItem } from "../../lib/types";

export function ShoppingListPage() {
  const { items, handleToggle, handleDelete } = useApp();
  const unchecked = items.filter((i: GroceryItem) => !i.checked).length;
  return (
    <div>
      <h1>Shopping List</h1>
      <p data-testid="total-count">{items.length} items</p>
      <p data-testid="unchecked-count">{unchecked} remaining</p>
      <ul>
        {items.map((item: GroceryItem) => (
          <li key={item.id} data-testid="grocery-item" style={{ textDecoration: item.checked ? "line-through" : "none" }}>
            <input
              type="checkbox"
              data-testid={`item-checkbox-${item.id}`}
              checked={item.checked}
              onChange={() => handleToggle(item.id)}
            />
            {item.quantity} {item.unit} {item.name} ({item.category})
            <button data-testid={`delete-btn-${item.id}`} onClick={() => handleDelete(item.id)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
