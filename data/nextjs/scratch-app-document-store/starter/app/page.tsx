import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "/" && <div data-testid="dashboard-page"><h1>Document Store</h1><div data-testid="doc-count">0</div><div data-testid="folder-count">0</div></div>}
      {route === "/documents" && (
        <div data-testid="documents-page">
          <h1>Documents</h1>
          <input data-testid="doc-title-input" placeholder="Title" />
          <input data-testid="doc-description-input" placeholder="Description" />
          <input data-testid="doc-url-input" placeholder="URL" />
          <select data-testid="doc-folder-select"><option value="">No Folder</option></select>
          <input data-testid="doc-tags-input" placeholder="Tags (comma-separated)" />
          <button data-testid="add-doc-btn">Add Document</button>
          <ul data-testid="doc-list"></ul>
        </div>
      )}
      {route === "/folders" && (
        <div data-testid="folders-page">
          <h1>Folders</h1>
          <input data-testid="folder-name-input" placeholder="Folder Name" />
          <input data-testid="folder-color-input" placeholder="Color" />
          <button data-testid="add-folder-btn">Add Folder</button>
          <ul data-testid="folder-list"></ul>
        </div>
      )}
      {route === "/shared" && <div data-testid="shared-page"><h1>Shared Documents</h1><ul data-testid="shared-list"></ul></div>}
      {route === "/search" && (
        <div data-testid="search-page">
          <h1>Search</h1>
          <input data-testid="search-input" placeholder="Search title or tag" />
          <button data-testid="search-btn">Search</button>
          <ul data-testid="search-results"></ul>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
