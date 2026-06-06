import React from "react";
import { useApp } from "../../components/AppStateProvider";
import { GroceryCategory, GroceryItem } from "../../lib/types";

const ALL_CATEGORIES: GroceryCategory[] = ["produce", "dairy", "meat", "bakery", "frozen", "pantry", "beverages"];

export function CategoriesPage() {
  const { items } = useApp();
  const withItems = ALL_CATEGORIES.filter((cat) => items.some((i: GroceryItem) => i.category === cat));
  return (
    <div>
      <h1>Categories</h1>
      {withItems.map((cat) => {
        const count = items.filter((i: GroceryItem) => i.category === cat).length;
        return (
          <div key={cat} data-testid="category-row">
            {cat}: {count}
          </div>
        );
      })}
    </div>
  );
}
