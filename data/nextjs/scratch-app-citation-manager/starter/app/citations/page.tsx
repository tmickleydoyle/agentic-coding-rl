import React from "react";
export function CitationsPage() {
  return (
    <div data-testid="citations-page">
      <h1>Citations</h1>
      <div data-testid="citation-form">
        <input data-testid="input-title" placeholder="Title" />
        <input data-testid="input-authors" placeholder="Authors" />
        <input data-testid="input-year" placeholder="Year" />
        <select data-testid="input-type"><option value="article">article</option></select>
        <input data-testid="input-url" placeholder="URL" />
        <input data-testid="input-collection" placeholder="Collection" />
        <textarea data-testid="input-notes" placeholder="Notes" />
        <button data-testid="btn-submit">Add Citation</button>
      </div>
      <ul data-testid="citations-list"></ul>
    </div>
  );
}
