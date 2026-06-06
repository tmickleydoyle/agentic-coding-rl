import React from "react";

export function SearchPage() {
  return (
    <div data-testid="search-page">
      <h1>Search Notes</h1>
      <div data-testid="search-form">
        <input data-testid="input-search" placeholder="Search..." />
        <button data-testid="btn-search">Search</button>
      </div>
    </div>
  );
}
