import React from "react";
export function ObjectivesPage() {
  return (
    <div data-testid="objectives-page">
      <h1>Objectives</h1>
      <div data-testid="objective-form">
        <input data-testid="input-title" placeholder="Title" />
        <textarea data-testid="input-description" placeholder="Description" />
        <input data-testid="input-quarter" placeholder="Quarter" />
        <select data-testid="input-status"><option value="on_track">on_track</option></select>
        <button data-testid="btn-submit">Add Objective</button>
      </div>
      <ul data-testid="objectives-list"></ul>
    </div>
  );
}
