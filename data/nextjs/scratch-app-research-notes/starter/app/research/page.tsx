import React from "react";

export function ResearchPage() {
  return (
    <div data-testid="research-page">
      <h1>Research Notes</h1>
      <div data-testid="note-form">
        <input data-testid="input-title" placeholder="Title" />
        <textarea data-testid="input-content" placeholder="Content" />
        <input data-testid="input-tags" placeholder="Tags (comma-separated)" />
        <input data-testid="input-source" placeholder="Source URL" />
        <button data-testid="btn-submit">Add Note</button>
      </div>
      <ul data-testid="notes-list"></ul>
    </div>
  );
}
