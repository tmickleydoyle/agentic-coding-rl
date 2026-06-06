"use client";
import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function SharedPage() {
  const { items } = useApp();
  const unpurchased = items.filter((i) => !i.purchased);

  return (
    <div data-testid="shared-page">
      <h2>My Wishlist</h2>
      <p data-testid="shared-count">Items: {unpurchased.length}</p>
      <ul data-testid="shared-list">
        {unpurchased.map((i) => (
          <li key={i.id} data-testid={`shared-item-${i.id}`}>
            <span data-testid={`shared-name-${i.id}`}>{i.name}</span>
            <span data-testid={`shared-price-${i.id}`}>${i.price}</span>
            <span data-testid={`shared-priority-${i.id}`}>{i.priority}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
