import React from "react";

export function ShoppingListPage() {
  return (
    <div>
      <h1>Shopping List</h1>
      <p data-testid="total-count">0 items</p>
      <p data-testid="unchecked-count">0 remaining</p>
    </div>
  );
}
