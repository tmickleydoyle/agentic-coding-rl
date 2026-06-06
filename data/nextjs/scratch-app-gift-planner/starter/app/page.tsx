import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "/" && <div data-testid="dashboard-page"><h1>Gift Planner</h1><div data-testid="occasion-count">0</div><div data-testid="total-spent">0</div></div>}
      {route === "/gifts" && (
        <div data-testid="gifts-page">
          <h1>Gifts</h1>
          <input data-testid="gift-title-input" placeholder="Title" />
          <input data-testid="gift-description-input" placeholder="Description" />
          <input data-testid="gift-price-input" placeholder="Price" type="number" />
          <select data-testid="gift-occasion-select"><option value="">Select Occasion</option></select>
          <select data-testid="gift-recipient-select"><option value="">Select Recipient</option></select>
          <button data-testid="add-gift-btn">Add Gift</button>
          <ul data-testid="gift-list"></ul>
        </div>
      )}
      {route === "/occasions" && (
        <div data-testid="occasions-page">
          <h1>Occasions</h1>
          <input data-testid="occasion-name-input" placeholder="Occasion Name" />
          <input data-testid="occasion-date-input" placeholder="Date" />
          <select data-testid="occasion-type-select"><option value="birthday">Birthday</option></select>
          <select data-testid="occasion-recipient-select"><option value="">No Recipient</option></select>
          <button data-testid="add-occasion-btn">Add Occasion</button>
          <ul data-testid="occasion-list"></ul>
          <h2>Recipients</h2>
          <input data-testid="recipient-name-input" placeholder="Recipient Name" />
          <input data-testid="recipient-relation-input" placeholder="Relation" />
          <button data-testid="add-recipient-btn">Add Recipient</button>
          <ul data-testid="recipient-list"></ul>
        </div>
      )}
      {route === "/budget" && <div data-testid="budget-page"><h1>Budget</h1><ul data-testid="budget-list"></ul></div>}
      {route === "/ideas" && <div data-testid="ideas-page"><h1>Ideas</h1><div data-testid="ideas-count">0</div><ul data-testid="ideas-list"></ul></div>}
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
