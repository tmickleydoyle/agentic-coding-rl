import React from "react";
export function ManagePage() {
  return (
    <div data-testid="manage-page">
      <h1>Manage Arguments</h1>
      <div data-testid="arg-form">
        <textarea data-testid="input-text" placeholder="Argument text" />
        <select data-testid="input-type"><option value="claim">claim</option></select>
        <select data-testid="input-parent"><option value="">None (top-level)</option></select>
        <input data-testid="input-topic" placeholder="Topic" />
        <button data-testid="btn-submit">Add Argument</button>
      </div>
      <ul data-testid="args-list"></ul>
    </div>
  );
}
