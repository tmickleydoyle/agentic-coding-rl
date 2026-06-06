import React from "react";
export function ItemsPage() {
  return (
    <div data-testid="items-page">
      <h1>Action Items</h1>
      <div data-testid="item-form">
        <input data-testid="input-title" placeholder="Title" />
        <input data-testid="input-assignee" placeholder="Assignee" />
        <input data-testid="input-due-date" type="date" />
        <select data-testid="input-priority"><option value="medium">medium</option></select>
        <textarea data-testid="input-notes" placeholder="Notes" />
        <button data-testid="btn-submit">Add Item</button>
      </div>
      <ul data-testid="items-list"></ul>
    </div>
  );
}
