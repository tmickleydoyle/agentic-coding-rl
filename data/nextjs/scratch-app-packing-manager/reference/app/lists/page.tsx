import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function ListsPage() {
  const { lists } = useApp();
  return (
    <div data-testid="lists-page">
      <h2>Packing Lists</h2>
      {lists.map((l) => (
        <div key={l.id} data-testid="list-card">
          <span data-testid="list-name">{l.tripName}</span>
          <span data-testid="list-destination">{l.destination}</span>
          <span data-testid="list-item-count">{l.items.length}</span>
        </div>
      ))}
    </div>
  );
}
