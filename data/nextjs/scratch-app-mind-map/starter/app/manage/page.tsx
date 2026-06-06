import React from "react";
export function ManagePage() {
  return (
    <div data-testid="manage-page">
      <h1>Manage Nodes</h1>
      <div data-testid="node-form">
        <input data-testid="input-label" placeholder="Label" />
        <select data-testid="input-parent"><option value="">Root</option></select>
        <select data-testid="input-color"><option value="blue">blue</option></select>
        <button data-testid="btn-submit">Add Node</button>
      </div>
      <ul data-testid="nodes-list"></ul>
    </div>
  );
}
