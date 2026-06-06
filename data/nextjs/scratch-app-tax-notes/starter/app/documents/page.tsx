import React from "react";
export function DocumentsPage() {
  return (
    <div data-testid="documents-page">
      <div data-testid="add-document-form">
        <input data-testid="doc-name" />
        <select data-testid="doc-type"><option value="other">other</option></select>
        <input data-testid="doc-year" type="number" />
        <input data-testid="doc-amount" type="number" />
        <button data-testid="add-doc-btn">Add Document</button>
      </div>
      <ul data-testid="document-list"></ul>
    </div>
  );
}
